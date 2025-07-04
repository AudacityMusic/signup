/**
 * PublicGoogleSheetsParser.js
 * Utility class to fetch and parse public Google Sheets data via the GViz API.
 * Usage:
 *   const parser = new PublicGoogleSheetsParser(sheetId, { sheetName });
 *   const rows = await parser.parse();
 */

// From https://github.com/fureweb-com/public-google-sheets-parser
// Copyright (c) 2020 Jihwan Oh
// MIT License

import { alertError } from ".";

export default class PublicGoogleSheetsParser {
  /**
   * @param {string} spreadsheetId - Google Spreadsheet ID
   * @param {object|string} option - sheetName string or config object
   */
  constructor(spreadsheetId, option) {
    this.id = spreadsheetId;
    this.setOption(option);
  }

  /**
   * Configure sheet name/id and parsing options.
   * @param {object|string|null} option
   */
  setOption(option) {
    // Preserve existing options if undefined
    if (!option) {
      this.sheetName = this.sheetName || null;
      this.sheetId = this.sheetId || null;
      this.useFormattedDate = this.useFormattedDate || false;
      this.useFormat = this.useFormat || false;
    } else if (typeof option === "string") {
      this.sheetName = option;
      this.sheetId = this.sheetId || null;
    } else if (typeof option === "object") {
      // Set from object with fallback
      this.sheetName = option.sheetName || this.sheetName;
      this.sheetId = option.sheetId || this.sheetId;
      this.useFormattedDate = option.hasOwnProperty("useFormattedDate")
        ? option.useFormattedDate
        : this.useFormattedDate;
      this.useFormat = option.hasOwnProperty("useFormat")
        ? option.useFormat
        : this.useFormat;
    }
  }

  /**
   * Check if a cell value is a serialized date string from Sheets.
   * @param {string} date
   * @returns {boolean}
   */
  isDate(date) {
    return (
      date && typeof date === "string" && /Date\((\d+),(\d+),(\d+)\)/.test(date)
    );
  }

  /**
   * Fetch raw GViz response text from the Sheets API.
   * @returns {Promise<string|null>}
   */
  async getSpreadsheetDataUsingFetch() {
    if (!this.id) return null;

    let url = `https://docs.google.com/spreadsheets/d/${this.id}/gviz/tq?`;
    url += this.sheetId ? `gid=${this.sheetId}` : `sheet=${this.sheetName}`;

    const response = await fetch(url);
    if (!response.ok) {
      alertError(
        `Response NOT OK ${response.status} when fetching spreadsheet data: ${response.statusText}`,
      );
      return null;
    }
    return response.text();
  }

  /**
   * Normalize row cells, converting nulls to empty objects.
   * @param {array} rows
   */
  normalizeRow(rows) {
    return rows.map((row) =>
      row && row.v !== null && row.v !== undefined ? row : {},
    );
  }

  /**
   * Map header columns to row values, constructing object per row.
   */
  applyHeaderIntoRows(header, rows) {
    return rows
      .map(({ c: row }) => this.normalizeRow(row))
      .map((row) =>
        row.reduce(
          (p, c, i) =>
            c.v !== null && c.v !== undefined
              ? Object.assign(p, {
                  [header[i]]: this.useFormat
                    ? c.f || c.v
                    : this.useFormattedDate && this.isDate(c.v)
                      ? c.f || c.v
                      : c.v,
                })
              : p,
          {},
        ),
      );
  }

  /**
   * Extract items array of objects from raw response text.
   * @param {string} spreadsheetResponse
   * @returns {array} parsed rows
   */
  getItems(spreadsheetResponse) {
    let rows = [];

    try {
      const payloadExtractRegex =
        /google\.visualization\.Query\.setResponse\(({.*})\);/;
      const [_, payload] = spreadsheetResponse.match(payloadExtractRegex);
      const parsedJSON = JSON.parse(payload);
      const hasSomeLabelPropertyInCols = parsedJSON.table.cols.some(
        ({ label }) => !!label,
      );
      if (hasSomeLabelPropertyInCols) {
        const header = parsedJSON.table.cols.map(({ label }) => label);

        rows = this.applyHeaderIntoRows(header, parsedJSON.table.rows);
      } else {
        const [headerRow, ...originalRows] = parsedJSON.table.rows;
        const header = this.normalizeRow(headerRow.c).map((row) => row.v);

        rows = this.applyHeaderIntoRows(header, originalRows);
      }
    } catch (e) {
      alertError(`Error parsing spreadsheet data: ${e}`);
    }

    return rows;
  }

  /**
   * Main parse entrypoint: fetch and return row objects.
   * @param {string} [spreadsheetId]
   * @param {object|string} [option]
   * @returns {Promise<array|null>}
   */
  async parse(spreadsheetId, option) {
    if (spreadsheetId) this.id = spreadsheetId;
    if (option) this.setOption(option);

    if (!this.id) throw new Error("SpreadsheetId is required.");

    const spreadsheetResponse = await this.getSpreadsheetDataUsingFetch();

    if (spreadsheetResponse == null) {
      return null;
    }

    return this.getItems(spreadsheetResponse);
  }
}
