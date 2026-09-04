import { Component } from '@angular/core';
import { StepAcolhimento } from './steps/step-acolhimento/step-acolhimento';

@Component({
  imports: [StepAcolhimento],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
