// components/empty-state/index.js
Component({
  properties: {
    icon: { type: String, value: '🍸' },
    title: { type: String, value: '什么都没有' },
    description: { type: String, value: '' },
    showAction: { type: Boolean, value: false },
    actionText: { type: String, value: '去逛逛' }
  },
  methods: {
    onAction() {
      this.triggerEvent('action');
    }
  }
});
