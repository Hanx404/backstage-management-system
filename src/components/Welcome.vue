<!--
 * @Author: Fan
 * @Date: 2021-12-20 16:02:07
 * @LastEditTime: 2021-12-21 15:43:45
 * @LastEditors: your name
 * @Description:
 * @FilePath: \vue后台管理\src\components\Welcome.vue
 * 焯!
-->
<template lang="html">
    <div class="welcome">
        <h1 class="line animation">欢迎来到电商管理系统</h1>
    </div>
</template>
<script>
export default {};
</script>
<style lang="less">
// 打字机效果
.welcome {
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  font-family: "Anonymous Pro", monospace;
  .line {
    width: 316px;
    border-right: 2px solid #000;
    font-size: 30px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
  }
  .animation {
    animation: grow 1.5s steps(300) 1s normal both,
      blink 500ms steps(300) infinite normal;
  }
  @keyframes grow {
    from {
      width: 0;
    }
    to {
      width: 316px;
    }
  }
  @keyframes blink {
    from {
      border-right-color: #000;
    }
    to {
      border-right-color: transparent;
    }
  }
}
</style>
