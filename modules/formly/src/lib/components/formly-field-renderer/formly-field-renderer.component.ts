import { Component, OnInit, Input, Inject, Optional, Output, EventEmitter } from '@angular/core';
import { ControlContainer, FormBuilder, Validators } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AttributeValue, AttributeSerializerService } from 'attributes';
import { InlineContext } from 'context';
import { Pane } from 'panels';
import { debounceTime } from 'rxjs/operators';
import { FormlyFieldContentHandler } from '../../handlers/formly-field-content.handler';

@Component({
  selector: 'classifieds-formly-field-renderer',
  templateUrl: './formly-field-renderer.component.html',
  styleUrls: ['./formly-field-renderer.component.scss']
})
export class FormlyFieldRendererComponent implements OnInit {

  @Input()
  settings: Array<AttributeValue> = [];

  @Input()
  contexts: Array<InlineContext> = [];

  @Input()
  panes: Array<Pane> = [];

  @Input()
  appearance = 'legacy';

  @Input()
  name: string;

  @Input()
  label: string;

  @Input()
  displayType: string;

  @Input()
  resolvedContext = {};

  @Input()
  state: any = {};

  @Input()
  tokens: Map<string, any>;

  @Output()
  stateChange = new EventEmitter<any>();

  fields: FormlyFieldConfig[] = [];
  model: any = {};

  constructor(
    private fb: FormBuilder,
    private handler: FormlyFieldContentHandler,
    private attributeSerializer: AttributeSerializerService,
    @Optional() public controlContainer?: ControlContainer
  ) { }

  ngOnInit(): void {
    this.handler.toObject(this.settings).subscribe(instance => {
      this.fields = [ { key: instance.key, type: instance.type } ];
    });
  }

  onSearchChange(input: string) {
    this.stateChange.next({ autocomplete: { input } });
  }

}
