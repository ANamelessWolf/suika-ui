import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SuiDeviceLayout } from './device-layout.model';
import { SuiLayoutContext, injectSuiLayout } from './layout-context';
import { SuiLayoutHost } from './layout-host.directive';

@Component({
  selector: 'sui-test-probe',
  template: `{{ layout.layout() }}`,
})
class Probe {
  readonly layout = injectSuiLayout();
}

@Component({
  imports: [SuiLayoutHost, Probe],
  template: `<div [suiLayoutHost]="forced()"><sui-test-probe /></div>`,
})
class Host {
  readonly forced = signal<SuiDeviceLayout | null>('mobile-portrait');
}

describe('SuiLayoutHost', () => {
  it('provides a forced layout to descendants and reflects it as a data attribute', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    const hostEl: HTMLElement = fixture.nativeElement.querySelector('[data-sui-layout]');
    expect(hostEl.getAttribute('data-sui-layout')).toBe('mobile-portrait');
    expect(fixture.nativeElement.textContent.trim()).toBe('mobile-portrait');

    fixture.componentInstance.forced.set('desktop-quarter');
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent.trim()).toBe('desktop-quarter');
  });

  it('falls back to the parent context when not forced and not measured', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.forced.set(null);
    await fixture.whenStable();

    const root = TestBed.inject(SuiLayoutContext);
    const hostEl: HTMLElement = fixture.nativeElement.querySelector('[data-sui-layout]');
    // jsdom does not lay out elements, so the host has no measured size.
    expect(hostEl.getAttribute('data-sui-layout')).toBe(root.layout());
  });
});
