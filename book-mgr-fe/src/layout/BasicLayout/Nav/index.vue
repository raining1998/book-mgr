<template>
    <div>
       <a-menu
            style="width: 100%"
            v-model:openKeys="openKeys"
            v-model:selectedKeys="selectedKeys"
            mode="inline" 
            :key="item.url" 
            v-for="(item) in menu"
            v-only-admin
        >
            <a-sub-menu 
                v-if="item.children"
            >
                <template #title>
                    <span><MailOutlined /><span>{{item.title}}</span></span>
                </template>
                <!-- <a-menu-item-group key="g1">
                    <a-menu-item key="1">Option 1</a-menu-item>
                    <a-menu-item key="2">Option 2</a-menu-item>
                </a-menu-item-group> -->
            </a-sub-menu>
            <a-menu-item @click="to(item.url)" :key="item.url" v-else>
                {{item.title}}
            </a-menu-item>
        </a-menu>
    </div>
</template>

<script src="./index.js"></script>


