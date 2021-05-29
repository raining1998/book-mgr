<template>
  <div>
    <a-spin :spinning="loading">
      <a-card>
        <div class="list">
          <div class="item">
            <div class="count">共{{baseInfo.total.book}}本</div>
            <div class="title">书籍</div>
          </div>
          <div class="item" v-only-admin>
            <div class="count">共{{baseInfo.total.user}}名</div>
            <div class="title">用户</div>
          </div>
          <div class="item" v-only-admin>
            <div class="count">共{{ baseInfo.total.log}}条</div>
            <div class="title">操作</div>
          </div>
        </div>
      </a-card>
    </a-spin>

    <a-card class="info">
        <div>
            <h3>欢迎使用图书管理系统！</h3>
            <p>地址：四川省宜宾市三江新区白塔路1号</p>
            <p>技术支持：计算机科学与工程学院_crl</p>
            <p>若有技术问题请联系：QQ：454589227</p>
            <p>Copyright ? 2012－ SICHUAN UNIVERSITY OF SCIENCE & ENGINEERING LIBRARY, All Rights Reserved</p>
            <p>四川轻化工大学图书馆 版权所有</p>
        </div>
    </a-card>

  </div>
</template>

<script src="./index.js"></script>

<style lang="scss" scoped>
  @import './index.scss';
</style>