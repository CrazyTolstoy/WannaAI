// dynamic-loader.service.ts
import { Injectable, ComponentFactoryResolver, Injector, ApplicationRef, ComponentRef, EmbeddedViewRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DynamicLoaderService {
  private currentComponentRef: ComponentRef<any> | null = null;

  constructor(private resolver: ComponentFactoryResolver, private injector: Injector, private appRef: ApplicationRef) {}

  loadComponent(componentType: any, container: HTMLElement): ComponentRef<any> | null {
    // Remove the current component if exists
    this.removeCurrentComponent();

    // Resolve the component factory
    const factory = this.resolver.resolveComponentFactory(componentType);

    // Create the component
    const componentRef = factory.create(this.injector);

    // Attach the component to the application so change detection will work
    this.appRef.attachView(componentRef.hostView);

    // Get the HTML element of the component
    const domElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    // Append the component to the specified container
    container.appendChild(domElement);

    // Update the current component reference
    this.currentComponentRef = componentRef;

    return componentRef;
  }

  private removeCurrentComponent() {
    if (this.currentComponentRef) {
      // Detach the component from the application
      this.appRef.detachView(this.currentComponentRef.hostView);

      // Remove the HTML element from the DOM
      this.currentComponentRef.location.nativeElement.remove();

      // Destroy the component to free up resources
      this.currentComponentRef.destroy();

      // Reset the current component reference
      this.currentComponentRef = null;
    }
  }
}
