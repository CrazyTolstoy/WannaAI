import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor() {}

  showToast(message: string, duration = 3000) {
    const toastElement = document.createElement('div');
    toastElement.classList.add('toast', 'show');
    toastElement.style.position = 'fixed';
    toastElement.style.zIndex = '9999';
    toastElement.style.left = '50%';
    toastElement.style.top = '50%';
    toastElement.style.transform = 'translate(-50%, -50%)'; // Adjusted for vertical centering
    toastElement.style.minWidth = '200px';
    toastElement.style.padding = '20px'; 
    toastElement.style.backgroundColor = 'lightgreen';
    toastElement.style.display = 'flex';
    toastElement.style.justifyContent = 'center'; // Horizontally center
    toastElement.style.alignItems = 'center'; // Vertically center
    toastElement.style.textAlign = 'center'; // Center text if it wraps
    toastElement.innerText = message;

    document.body.appendChild(toastElement);

    setTimeout(() => {
      toastElement.classList.remove('show');
      document.body.removeChild(toastElement);
    }, duration);
  }
}
