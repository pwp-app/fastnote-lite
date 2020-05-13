<template>
    <div class="landing-main landing-update animated fadeIn faster">
        <div class="landing-update-title">
            <span>更新日志</span>
        </div>
        <el-tabs
            v-model="activeTab"
        >
            <el-tab-pane v-for="v in logs" :key="v.version" :label="v.version" :name="v.version">
                <el-timeline>
                    <el-timeline-item v-for="log in v.logs" :key="log.version" :timestamp="log.version" placement="top">
                        <p class="landing-update-time">发布时间：{{log.time}}</p>
                        <p class="landing-update-content" v-for="(update, index) in log.updates" :key="index">
                            {{update}}
                        </p>
                    </el-timeline-item>
                </el-timeline>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import UpdateLogs from '../../config/updatelog';

export default {
    name: "Landing.UpdateLog",
    data() {
        return {
            activeTab: "0.3.x",
            logs: UpdateLogs
        };
    }
};
</script>