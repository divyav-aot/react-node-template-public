/* eslint-disable @typescript-eslint/no-explicit-any */
export class LoggerFormat {
  public prepareLoggerMessageFormat (message:string, reqObj:any) {
    const msg = message + ' ' + reqObj
    return msg
  }
}
