import { Type } from '@angular/core';
import { AsyncValidatorFn } from '@angular/forms';
import { Plugin } from '@rollthecloudinc/plugin';
import { Param } from '@rollthecloudinc/dparam';
import { AttributeValue } from '@rollthecloudinc/attributes';
import { Observable } from 'rxjs';

export class ValidationPlugin<T = string> extends Plugin<T>  {
  editor: Type<any>;
  builder: ({ v }: { v: ValidationValidator }) => Observable<AsyncValidatorFn>;
  constructor(data?: ValidationPlugin<T>) {
    super(data)
    if(data) {
      this.editor = data.editor;
      this.builder = data.builder;
    }
  }
}
export class ValidationValidator {
  name: string;
  validator: string;
  paramSettings?: ValidationValidatorSettings; 
  constructor(data?: ValidationValidator) {
    if (data) {
      this.name = data.name;
      this.validator = data.validator;
      if (data.paramSettings && typeof(data.paramSettings) !== 'string') {
        this.paramSettings = new ValidationValidatorSettings(data.paramSettings);
      }
    }
  }
}

export class ValidationValidatorSettings {
  paramsString: string;
  params: Array<Param> = [];
  constructor(data?: ValidationValidatorSettings) {
    if (data) {
      this.paramsString = data.paramsString;
      if (data.params && Array.isArray(data.params)) {
        this.params = data.params.map(p => new Param(p));
      }
    }
  }
}

export class FormValidation {
  validators: Array<ValidationValidator>;
  constructor(data: FormValidation) {
    if (data && Array.isArray(data.validators)) {
      this.validators = data.validators.map(v => new ValidationValidator(v));
    }
  }
}
