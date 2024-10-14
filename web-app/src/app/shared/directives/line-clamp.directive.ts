import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  AfterViewInit,
} from '@angular/core';

@Directive({
  selector: '[appLineClamp]',
  standalone: true,
})
export class LineClampDirective implements AfterViewInit {
  @Input('appLineClamp') lineCount: number = 2;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    const element = this.el.nativeElement;

    this.renderer.setStyle(element, 'overflow', 'hidden');
    this.renderer.setStyle(element, 'display', '-webkit-box');
    this.renderer.setStyle(element, '-webkit-box-orient', 'vertical');
    this.renderer.setStyle(
      element,
      '-webkit-line-clamp',
      this.lineCount.toString()
    );
  }
}
