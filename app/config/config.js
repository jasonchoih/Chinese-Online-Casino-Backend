module.exports = {
    // 开奖数据
    redis_1_Config: {
        port: 6379,
        host: '127.0.0.1',
        password: 'UJt@x+===weUtw_y?bEaFBn2Ff$+AW',
        db: 0,
    },
    // sd28 - 数据
    redis_2_Config: {
        port: 6379,
        host: '127.0.0.1',
        password: 'UJt@x+===weUtw_y?bEaFBn2Ff$+AW',
        db: 1,
    },
    // sd28.com - 自动机器人
    sd28_auto: {
        port: 6379,
        host: '127.0.0.1',
        password: 'UJt@x+===weUtw_y?bEaFBn2Ff$+AW',
        db: 2,
    },
    // 数据库
    sequelizeSD28: {
        host: 'localhost',
        port: '3306',
        username: 'root',
        password: 'k9=@*SCT?-LbSky7FcrKMmvXu',
        database: 'sd28_com_20210603'
    },
    // 加密钥匙
    akey: 'D2ApxLk9G3PAsJrM',
    bkey: 'F3JL7ED6jqWjcrY9',
    // 允许访问的域名
    origins: [
        'http://localhost:6724',
        'http://localhost:6725',
        // 
        'https://sdwsocket.ncshouda.com',
        'https://mgsock.qiuwenbo.top',
        'mgw.izcy.top',
        'https://w.yanyh.top',
        'https://w.chenhouzhang.top',
        'https://w.edusky.top',
        // 
        'https://www.shubaokt.com',
        'https://www.chatterfu.com',
        'https://www.tcphb.com',
        // 
        'https://hk.couponze.com',
        // 
        'https://www.couponze.com',
        'https://www.bribruce.com',
        'https://www.saimx.com',
        'https://www.mycprpro.com',
        'https://www.shdihua.com',
        'https://www.saikmusic.com'
    ],
    // 路径白名单
    pathWhite:{
        // 桌面端
        w:[
            'home/index',
            'home/game',
            'home/news',
            'home/activy',
            'home/rank',
            'home/agents',
            'eniu_home/index',
            'eniu_home/newshome',
            'eniu_activy/activym',
            //
            'auth/registercode',
            'auth/register',
            'auth/logincode',
            'auth/login',
            'auth/forgotcode',
            'auth/forgot',
            //
            'auth_ncp/registercode',
            'auth_ncp/register',
            'auth_ncp/forgotcode',
            'auth_ncp/forgot',
            'auth_ncp/logincode',
            'auth_ncp/login',
        ],
        // 手机端
        m:[
            'home/index',
            'home/game',
            'home/news',
            'home/activy',
            'home/rank',
            'home/agents',
            //
            'auth/registercode',
            'auth/register',
            'auth/logincode',
            'auth/login',
            'auth/forgotcode',
            'auth/forgot',
        ]
    }
}