<template>
  <el-button @click="handleClick" :disabled="disabled">{{displayText}}</el-button>
</template>

<script>
export default {
  props: {
    text: String,
		count: Number,
		countAutoStart: {
			type: Boolean,
			default: false,
		}
  },
  data() {
    return {
			displayText: this.text || '',
			disabled: false,
			currentCount: 0,
			countInterval: null,
    }
	},
	methods: {
		handleClick() {
			this.disabled = true;
			if (this.countAutoStart) {
				this.startCount();
			}
			this.$emit('click');
		},
		startCount() {
			this.currentCount = this.count;
			this.countInterval = setInterval(() => {
				if (this.currentCount <= 0) {
					this.displayText = this.text;
					this.disabled = false;
					clearInterval(this.countInterval);
					this.countInterval = null;
					return;
				}
				this.currentCount -= 1;
				this.displayText = this.currentCount;
			}, 1000);
		},
		clear() {
			if (this.countInterval) {
				clearInterval(this.countInterval);
			}
			this.disabled = false;
		},
	}
}
</script>