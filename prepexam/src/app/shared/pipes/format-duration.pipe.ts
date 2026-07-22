import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatDuration', standalone: true })
export class FormatDurationPipe implements PipeTransform {
  transform(minutes: number): string {
    if (!minutes || minutes <= 0) return '0m';
    if (minutes < 60) return `${minutes}m`;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  }
}
