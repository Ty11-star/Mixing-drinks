// components/difficulty-tag/index.js
const format = require('../../utils/format');

Component({
  properties: {
    level: { type: Number, value: 1 },
    showLabel: { type: Boolean, value: true }
  },
  data: { meta: {} },
  lifetimes: {
    attached() { this.update(); }
  },
  observers: {
    level() { this.update(); }
  },
  methods: {
    update() {
      this.setData({ meta: format.getDifficulty(this.data.level) });
    }
  }
});
