// tslint:disable-next-line: ban-types
export const filesUploaderComponent = (constructorFn: Function): void => {
  if (typeof constructorFn.prototype.setStatus !== 'function') {
    // tslint:disable-next-line: no-empty
    constructorFn.prototype.setStatus = () => {};
  }
  if (typeof constructorFn.prototype.setError !== 'function') {
    // tslint:disable-next-line: no-empty
    constructorFn.prototype.setError = () => {};
  }
};
