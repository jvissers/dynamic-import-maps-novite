import { reactive } from 'vue';
import html from '../utils/html.js';

export default {
  setup() {
    const state = reactive({
      count: 0,
    });

    function increment() {
      state.count++;
    }

    return () => html`<div onclick=${increment}>${state.count}</div>`;
  },
};
