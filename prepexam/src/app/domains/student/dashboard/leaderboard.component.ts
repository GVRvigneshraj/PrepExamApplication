import { CommonModule } from '@angular/common';
import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface LeaderboardUser {
  rank: number;
  name: string;
  level: string;
  score: number;
}

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss',
})
export class StudentLeaderboardComponent {

  searchText = signal<string>('');

  allPlayers = signal<LeaderboardUser[]>([
    { rank: 1, name: 'Aman Verma', level: 'Champion', score: 12850 },
    { rank: 2, name: 'Rohit Singh', level: 'Challenger', score: 8420 },
    { rank: 3, name: 'Neha Sharma', level: 'Master', score: 6980 },
    { rank: 4, name: 'Arjun Mehta', level: 'Expert', score: 6120 },
    { rank: 5, name: 'Ishita Roy', level: 'Expert', score: 5430 },
    { rank: 6, name: 'Vivaan Kapoor', level: 'Pro', score: 4980 },
  ]);

  currentUser = signal<LeaderboardUser>({
    rank: 12,
    name: 'Aman Verma',
    level: 'Challenger',
    score: 2620
  });

  filteredPlayers = computed(() => {
    const query = this.searchText().toLowerCase().trim();
    if (!query) {
      return this.allPlayers();
    }
    return this.allPlayers().filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.level.toLowerCase().includes(query)
    );
  });
}
