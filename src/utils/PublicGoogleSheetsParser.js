// From https://github.com/fureweb-com/public-google-sheets-parser
// Copyright (c) 2020 Jihwan Oh
// MIT License

import { alertError } from ".";

export default class PublicGoogleSheetsParser {
  constructor(spreadsheetId, option) {
    this.id = spreadsheetId;
    this.setOption(option);
  }

  setOption(option) {
    if (!option) {
      this.sheetName = this.sheetName || null;
      this.sheetId = this.sheetId || null;
      this.useFormattedDate = this.useFormattedDate || false;
      this.useFormat = this.useFormat || false;
    } else if (typeof option === "string") {
      this.sheetName = option;
      this.sheetId = this.sheetId || null;
    } else if (typeof option === "object") {
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

  isDate(date) {
    return (
      date && typeof date === "string" && /Date\((\d+),(\d+),(\d+)\)/.test(date)
    );
  }

  async getSpreadsheetDataUsingFetch() {
    if (!this.id) return null;

    let url = `https://docs.google.com/spreadsheets/d/${this.id}/gviz/tq?`;
    url += this.sheetId ? `gid=${this.sheetId}` : `sheet=${this.sheetName}`;

    try {
      const response = await fetch(url);
      return response && response.ok ? response.text() : null;
    } catch (e) {
      /* istanbul ignore next */
      alertError("Error fetching spreadsheet data: " + e);
      /* istanbul ignore next */
      return null;
    }
  }

  normalizeRow(rows) {
    return rows.map((row) =>
      row && row.v !== null && row.v !== undefined ? row : {},
    );
  }

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
      /* istanbul ignore next */
      alertError("Error parsing spreadsheet data: " + e);
    }

    return rows;
  }

  async parse(spreadsheetId, option) {
    if (spreadsheetId) this.id = spreadsheetId;
    if (option) this.setOption(option);

    if (!this.id) throw new Error("SpreadsheetId is required.");

    const spreadsheetResponse = await this.getSpreadsheetDataUsingFetch();

    if (spreadsheetResponse === null) return [];

    return this.getItems(spreadsheetResponse);
  }
}
