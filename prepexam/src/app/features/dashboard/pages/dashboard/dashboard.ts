import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  level = 7;

  xp = 2450;

  totalXP = 5000;

  progress = 49;

  stats = [
    {
      title: 'Assessments',
      value: 48,
      icon: 'fas fa-clipboard-check',
      bg: '#f0ebff',
      color: '#6d4cff'
    },
    {
      title: 'Mock Tests',
      value: 27,
      icon: 'fas fa-file-alt',
      bg: '#e0f7fa',
      color: '#0097a7'
    },
    {
      title: 'Accuracy',
      value: '72.4%',
      icon: 'fas fa-bullseye',
      bg: '#e8f5e9',
      color: '#43a047'
    },
    {
      title: 'Day Streak',
      value: 12,
      icon: 'fas fa-fire',
      bg: '#fff3e0',
      color: '#ef6c00'
    }
  ];

  assistant = [
    {
      title:'Ask',
      subtitle:'Ask any doubt instantly',
      icon:'fas fa-question-circle',
      bg:'#f0ebff',
      color:'#6d4cff'
    },
    {
      title:'Explain',
      subtitle:'Step-by-step explanation',
      icon:'fas fa-lightbulb',
      bg:'#e0f7fa',
      color:'#0097a7'
    },
    {
      title:'Practice',
      subtitle:'Personalized questions',
      icon:'fas fa-pen',
      bg:'#e8f5e9',
      color:'#43a047'
    },
    {
      title:'Review',
      subtitle:'Track weak areas',
      icon:'fas fa-redo',
      bg:'#fff3e0',
      color:'#ef6c00'
    }
  ];

  assessments = [
    {
      subject:'Quantitative Aptitude',
      questions:20,
      score:85,
      icon:'fas fa-calculator',
      bg:'#f0ebff',
      color:'#6d4cff'
    },
    {
      subject:'Logical Reasoning',
      questions:15,
      score:70,
      icon:'fas fa-brain',
      bg:'#e0f7fa',
      color:'#0097a7'
    },
    {
      subject:'English Language',
      questions:20,
      score:65,
      icon:'fas fa-language',
      bg:'#fff3e0',
      color:'#ef6c00'
    }
  ];

  toasts:string[]=[];

  showToast(message:string){

    this.toasts.push(message);

    setTimeout(()=>{
      this.toasts.shift();
    },2500);

  }

}