import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule as NgFormsModule } from '@angular/forms';
import { MaterialModule } from '@rollthecloudinc/material';
import { ContentPluginManager } from '@rollthecloudinc/content';
import { StylePluginManager } from '@rollthecloudinc/panels';
import { FormInputComponent } from './components/form-input/form-input.component';
import { FormSelectComponent } from './components/form-select/form-select.component';
import { formAutocompletePluginFactory, formCheckboxPluginFactory, formDatepickerPluginFactory, formHiddenPluginFactory, formInputPluginFactory, formMediaPluginFactory, formRadiogroupPluginFactory, formSectionStylePluginFactory, formSelectPluginFactory, formSliderPluginFactory, formTextareaPluginFactory, formTogglePluginFactory } from './forms.factories';
import { FormSectionComponent } from './components/form-section/form-section.component';
import { FormTextareaComponent } from './components/form-textarea/form-textarea.component';
import { RenderModule } from '@rollthecloudinc/render';
import { FormElementHandler } from './handlers/form-element.handler';
import { FormElementEditorComponent } from './components/form-element-editor/form-element-editor.component';
import { DatasourceModule } from '@rollthecloudinc/datasource';
import { FormRadiogroupComponent } from './components/form-radiogroup/form-radiogroup.component';
import { FormSliderComponent } from './components/form-slider/form-slider.component';
import { FormToggleComponent } from './components/form-toggle/form-toggle.component';
import { FormCheckboxComponent } from './components/form-checkbox/form-checkbox.component';
import { FormDatepickerComponent } from './components/form-datepicker/form-datepicker.component';
import { FormAutocompleteComponent } from './components/form-autocomplete/form-autocomplete.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormMediaComponent } from './components/form-media/form-media.component';
import { FormHiddenComponent } from './components/form-hidden/form-hidden.component';
import { FormSectionEditorComponent } from './components/form-section-editor/form-section-editor.component';
import { OrdainModule } from '@rollthecloudinc/ordain';
@NgModule({
  declarations: [
    FormInputComponent,
    FormSelectComponent,
    FormSectionComponent,
    FormTextareaComponent,
    FormElementEditorComponent,
    FormRadiogroupComponent,
    FormSliderComponent,
    FormToggleComponent,
    FormCheckboxComponent,
    FormDatepickerComponent,
    FormAutocompleteComponent,
    FormMediaComponent,
    FormHiddenComponent,
    FormSectionEditorComponent
  ],
  imports: [
    CommonModule,
    NgFormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RenderModule,
    DatasourceModule,
    NgxDropzoneModule,
    OrdainModule
  ],
  exports: [
    FormInputComponent,
    FormSelectComponent,
    FormSectionComponent,
    FormElementEditorComponent,
    FormRadiogroupComponent,
    FormSliderComponent,
    FormToggleComponent,
    FormCheckboxComponent,
    FormDatepickerComponent,
    FormAutocompleteComponent,
    FormMediaComponent,
    FormHiddenComponent,
    FormSectionEditorComponent
  ]
})
export class FormsModule { 
  constructor(
    cpm: ContentPluginManager,
    spm: StylePluginManager,
    handler: FormElementHandler
  ) {
    [
      formInputPluginFactory({ handler }),
      formSelectPluginFactory({ handler }),
      formTextareaPluginFactory({ handler }),
      formRadiogroupPluginFactory({ handler }),
      formSliderPluginFactory({ handler }),
      formTogglePluginFactory({ handler }),
      formCheckboxPluginFactory({ handler }),
      formDatepickerPluginFactory({ handler }),
      formAutocompletePluginFactory({ handler }),
      formMediaPluginFactory({ handler }),
      formHiddenPluginFactory({ handler })
    ].forEach(p => cpm.register(p));
    [
      formSectionStylePluginFactory()
    ].forEach(p => spm.register(p));
  }
}
