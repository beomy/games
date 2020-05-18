import Home from '@/views/Home.svelte';
import twoZeroFourEight from '@/views/twoZeroFourEight.svelte';
import Sudoku from '@/views/Sudoku.svelte';

export const routes: any = {
  '/': Home,
  '/2048Game': twoZeroFourEight,
  '/sudoku': Sudoku,
};
