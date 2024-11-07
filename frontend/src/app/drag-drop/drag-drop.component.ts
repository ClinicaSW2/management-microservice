import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImagePredictionService } from '../services/image-prediction.service';

@Component({
  selector: 'app-drag-drop',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss']
})
export class DragDropComponent {
  selectedImage: string | null = null;
  predictedLabels: string[] = [];
  confidenceScores: number[] = [];
  errorMessage: string | null = null;
  isLoading = false;

  constructor(private imagePredictionService: ImagePredictionService) {}

  handleDrop(event: DragEvent) {
    event.preventDefault();
    this.errorMessage = null;
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedImage = URL.createObjectURL(file);
      this.uploadImage(file);
    } else {
      this.errorMessage = 'Please drop a valid image file.';
    }
  }

  handleFileChange(event: Event) {
    this.errorMessage = null;
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedImage = URL.createObjectURL(file);
      this.uploadImage(file);
    } else {
      this.errorMessage = 'Please select a valid image file.';
    }
  }

  uploadImage(file: File) {
    this.isLoading = true;
    this.imagePredictionService.predictImageLabels(file).subscribe({
      next: (data) => {
        this.predictedLabels = data.predicted_labels;
        this.confidenceScores = data.confidence_scores;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
  }
}
