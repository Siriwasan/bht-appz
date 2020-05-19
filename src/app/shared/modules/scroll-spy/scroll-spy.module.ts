import { NgModule } from '@angular/core';
import { ScrollSpyElementDirective } from './scroll-spy-element.directive';
import { ScrollSpyService } from './scroll-spy.service';

@NgModule({
  declarations: [ScrollSpyElementDirective],
  imports: [],
  exports: [ScrollSpyElementDirective],
  providers: [ScrollSpyService],
})
export class ScrollSpyModule {}
