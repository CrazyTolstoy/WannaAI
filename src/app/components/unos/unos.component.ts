import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
// Removed unused imports: UnosService and Router

// This is a mock DTO (Data Transfer Object) for demonstration.
// Replace this with your actual DTO structure.
interface UnosDTO {
  itemId: number | undefined; // Changed to allow undefined if cell is empty
  itemDescription: string | undefined; // Changed to allow undefined
  quantity: number | undefined; // Changed to allow undefined
  price: number | undefined; // Changed to allow undefined
}

@Component({
  selector: 'app-unos',
  templateUrl: './unos.component.html',
  styleUrls: ['./unos.component.scss'],
})
export class UnosComponent {
  // Property to hold the selected file
  file: File | null = null;
  
  // Store the raw worksheet for direct cell access
  private worksheet: XLSX.WorkSheet | null = null;
  
  // Store the single DTO object mapped from specific cells
  dataToUpload: UnosDTO | null = null;
  
  // Status message to provide user feedback
  statusMessage: string = '';

  constructor() {
    // No services injected as per previous request
  }

  /**
   * Handles the file selection event from the input field.
   * Reads the file and processes it.
   * @param event The file change event.
   */
  onFileChange(event: any) {
    this.statusMessage = 'Reading file...';
    this.file = event.target.files[0];
    this.dataToUpload = null; // Clear previous data

    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          // Read the file data
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first sheet name
          const firstSheetName = workbook.SheetNames[0];
          this.worksheet = workbook.Sheets[firstSheetName];
          
          this.statusMessage = `File '${this.file!.name}' loaded. Ready to map specific cells.`;
          
          // Map the Excel data from specific cells to the DTO
          this.mapToDto();
        } catch (error: any) {
          console.error('Error reading Excel file:', error);
          this.statusMessage = `Error reading file: ${error.message || 'Unknown error'}. Please ensure it's a valid .xlsx file.`;
          this.file = null;
          this.worksheet = null;
        }
      };
      reader.readAsArrayBuffer(this.file);
    }
  }

  /**
   * Maps values from specific Excel cells to the DTO structure.
   * You need to adjust the cell addresses (e.g., 'A2', 'B3') to match your Excel file.
   */
  mapToDto(): void {
    if (!this.worksheet) {
      this.statusMessage = 'No Excel worksheet loaded to map.';
      this.dataToUpload = null;
      return;
    }
    
    // Initialize a new DTO object
    const newUnosDTO: UnosDTO = {
      itemId: undefined,
      itemDescription: undefined,
      quantity: undefined,
      price: undefined
    };

    // --- CUSTOM MAPPING LOGIC ---
    // Access cell values by their address.
    // Use optional chaining (?.) and nullish coalescing (??) for robustness.
    // The .v property holds the cell's raw value.

    // Example mapping:
    // Cell A2 for itemId
    const cellA2 = this.worksheet['A2'];
    newUnosDTO.itemId = cellA2 ? (typeof cellA2.v === 'number' ? cellA2.v : parseInt(cellA2.v, 10)) : undefined;

    // Cell B3 for itemDescription
    const cellB3 = this.worksheet['B3'];
    newUnosDTO.itemDescription = cellB3 ? String(cellB3.v) : undefined;

    // Cell C4 for quantity
    const cellC4 = this.worksheet['C4'];
    newUnosDTO.quantity = cellC4 ? (typeof cellC4.v === 'number' ? cellC4.v : parseFloat(cellC4.v)) : undefined;

    // Cell D5 for price
    const cellD5 = this.worksheet['D5'];
    newUnosDTO.price = cellD5 ? (typeof cellD5.v === 'number' ? cellD5.v : parseFloat(cellD5.v)) : undefined;

    // Assign the mapped DTO
    this.dataToUpload = newUnosDTO;

    // Check if at least one field was successfully mapped to give meaningful status
    if (Object.values(newUnosDTO).some(val => val !== undefined)) {
      this.statusMessage = 'Data mapped from specific cells. Ready for processing.';
    } else {
      this.statusMessage = 'No data found in specified cells. Please check your Excel file and mapping.';
    }
  }

  /**
   * Logs the DTO data to the console.
   */
  uploadData(): void {
    if (!this.dataToUpload) {
      this.statusMessage = 'No data to process. Please map data from a file first.';
      return;
    }

    this.statusMessage = 'Processing data...';
    
    // Logging data to console
    console.log('DTO data from specific cells (logged to console):', this.dataToUpload);

    this.statusMessage = 'Data processed and logged to console!';
    // Optional: Reset form
    this.file = null;
    this.worksheet = null;
    this.dataToUpload = null;
  }
}