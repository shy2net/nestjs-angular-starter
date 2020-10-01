import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormValidatorDirective } from './directives';

@NgModule({
  imports: [CommonModule],
  exports: [FormValidatorDirective],
  declarations: [FormValidatorDirective],
})
export class SharedModule {}
