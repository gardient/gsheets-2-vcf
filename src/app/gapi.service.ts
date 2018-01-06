import { bindCallback } from 'rxjs/Observable/bindCallback';
import { fromPromise } from 'rxjs/Observable/fromPromise';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

const API_KEY = 'AIzaSyA9BX0C-ku3NBkTSeHY59DiJi02U-DbCe0';
const CLIENT_ID = '505888163689-q01h4puni0e74t36m04mcksr0g7pti5v.apps.googleusercontent.com';

const DISCOVERY_DOCS: string[] = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

function gapiRequestToObservable<T>(request: gapi.client.Request<T>): Observable<T> {
  return fromPromise<gapi.client.Response<T>>(request).map(res => res.result);
}

/**
 * Takes a positive integer and returns the corresponding column name.
 * @param {number} num  The positive integer to convert to a column name.
 * @return {string}  The column name.
 */
function numberToColumnName(num: number): string {
  let ret = '';
  for (; num > 0; num = Math.floor(num % 26)) {
    num--; // because nobody starts counting columns at 0 and A needs to be 1
    ret = String.fromCharCode(Math.floor(num % 26) + 65) + ret;
  }
  return ret;
}

@Injectable()
export class GApiService {
  private observableGetAuthInstance: () => Observable<boolean>;
  private authInstance: gapi.auth2.GoogleAuth;

  constructor () {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      }).then(() => {
        this.authInstance = gapi.auth2.getAuthInstance();
        // Listen for sign-in state changes.
        this.observableGetAuthInstance = bindCallback<boolean>(this.authInstance.isSignedIn.listen);
      });
    });
  }

  get authStatusChange(): Observable<boolean> { return this.observableGetAuthInstance(); }

  isAuthenticated (): boolean {
    return this.authInstance.isSignedIn.get();
  }

  signIn (): void {
    gapi.auth2.getAuthInstance().signIn();
  }

  signOut (): void {
    gapi.auth2.getAuthInstance().signOut();
  }

  getSpreadsheet (id: string): Observable<gapi.client.sheets.Spreadsheet> {
    return gapiRequestToObservable<gapi.client.sheets.Spreadsheet>(gapi.client.spreadsheets.get({
      spreadsheetId: id
    }));
  }

  getDataOnSheet (spreadsheetId: string, sheet: gapi.client.sheets.Sheet) {
    gapi.client.spreadsheets.values.get({
      spreadsheetId,
      range: sheet.properties.title + '!A1:1',
      majorDimension: 'ROWS'
    }).then(firstRowResponse => {
      const firstRow = firstRowResponse.result.values[0];
      gapi.client.spreadsheets.values.get({
        spreadsheetId,
        range: sheet.properties.title + '!A1:' + numberToColumnName(firstRow.length)
      });
    });
  }
}
