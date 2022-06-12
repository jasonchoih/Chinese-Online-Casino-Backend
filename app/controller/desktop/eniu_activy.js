const dayjs = require('dayjs');
const { get_2 } = require('../../plugin/redis');
const { numberToMoney } = require('../../service/tool');
// 
// 时间判断
const timeCheck = async(d) => 
{
    const { start_time, end_time } = d;
    // 
    const _start = dayjs(start_time).diff(dayjs(),'second');
    if(_start>0) return '<b>未开始</b>';
    //
    const _end = dayjs(end_time).diff(dayjs(),'second');
    if(_end<=0) return '<b>已结束</b>';
    //
    return '进行中';
};
// 
const activy_table = async(d,odd,pix)=>
{
    let _r = '';
    for(let i in d)
    {
        let _di = d[i];
        _r+='<tr><td>'+_di['ls']+(odd||'')+'</td><td>'+_di['odd']+(pix||'')+'</td></tr>';
    }
    return _r;
};
// 
const activy = async(d) => 
{
    const _arr = ['HdflScfl','HdflYgz','HdflTzfl','HdflKsfl','HdflXxfl'];
    let _hdfl = {};
    for(let i in _arr)
    {
        const _n = _arr[i];
        _hdfl[_n] = await get_2(_n);
    }
    //
    let Activys = [];
    // 
    Activys[0] = 
    [
        [
            '<h3>首充返利</h3>'+
            '<p style="margin-bottom:10px">以每天第一笔充值为准，隔天领取，当天未领取则失效，规则如下：</p>'+
            '<div class="boe br5 table mb10"><table class="hover">'+
            '<tr><th>有效流水</th><th>返利比例</th></tr>'+
            await activy_table(_hdfl['HdflScfl']['data'],' 倍',' %')+
            '</table></div>'+
            '<p>最高返利：<b>'+await numberToMoney(_hdfl['HdflScfl']['max'])+'</b> 豆</p>'+
            '<p style="margin-bottom:5px">活动时间：'+_hdfl['HdflScfl']['start_time']+' 至 '+_hdfl['HdflScfl']['end_time']+'</p>'+
            '<p>活动状态：'+await timeCheck(_hdfl['HdflScfl'])+'</p>'
        ],
        [
            _hdfl['HdflScfl']['start_time'], _hdfl['HdflScfl']['end_time'], await timeCheck(_hdfl['HdflScfl'])
        ]

    ];
    Activys[1] = 
    [
        [
            '<h3>月工资</h3>'+
            '<p style="margin-bottom:10px">合计当月有效流水，隔月领取，当月未领取则失效，规则如下：</p>'+
            '<div class="boe br5 table mb10"><table class="hover">'+
            '<tr><th>有效流水</th><th>返利金豆</th></tr>'+
            await activy_table(_hdfl['HdflYgz']['data'],'',' 豆')+
            '</table></div>'+
            '<p style="margin-bottom:5px">活动时间：'+_hdfl['HdflYgz']['start_time']+' 至 '+_hdfl['HdflYgz']['end_time']+'</p>'+
            '<p>活动状态：'+await timeCheck(_hdfl['HdflYgz'])+'</p>'
        ],
        [
            _hdfl['HdflYgz']['start_time'], _hdfl['HdflYgz']['end_time'], await timeCheck(_hdfl['HdflYgz'])
        ]
    ]
    Activys[2] = 
    [
        [
            '<h3>投注返利</h3>'+
            '<p style="margin-bottom:10px">合计当天游戏投注金豆，隔天领取，当天未领取则失效，规则如下：</p>'+
            '<p>有效流水：<b>'+_hdfl['HdflTzfl']['ls']+'</b> 倍</p>'+
            '<p>返利比例：<b>'+_hdfl['HdflTzfl']['odd']+'</b> %</p>'+
            '<p>最高返利：<b>'+await numberToMoney(_hdfl['HdflTzfl']['max'])+'</b> 豆</p>'+
            '<p style="margin-bottom:5px">活动时间：'+_hdfl['HdflTzfl']['start_time']+' 至 '+_hdfl['HdflTzfl']['end_time']+'</p>'+
            '<p>活动状态：'+await timeCheck(_hdfl['HdflTzfl'])+'</p>'
        ],
        [
            _hdfl['HdflTzfl']['start_time'], _hdfl['HdflTzfl']['end_time'], await timeCheck(_hdfl['HdflTzfl'])
        ]
    ]
    Activys[3] = 
    [
        [
            '<h3>亏损返利</h3>'+
            '<p style="margin-bottom:10px">合计当天游戏投注亏损金豆，隔天领取，当天未领取则失效，规则如下：</p>'+
            '<div class="boe br5 table mb10"><table class="hover">'+
            '<tr><th>有效流水</th><th>返利比例</th></tr>'+
            await activy_table(_hdfl['HdflKsfl']['data'],' 倍',' %')+
            '</table></div>'+
            '<p>亏损金豆：<b>'+await numberToMoney(_hdfl['HdflKsfl']['dou'])+'</b> 豆起</p>'+
            '<p>最高返利：<b>'+await numberToMoney(_hdfl['HdflKsfl']['max'])+'</b> 豆</p>'+
            '<p style="margin-bottom:5px">活动时间：'+_hdfl['HdflKsfl']['start_time']+' 至 '+_hdfl['HdflKsfl']['end_time']+'</p>'+
            '<p>活动状态：'+await timeCheck(_hdfl['HdflKsfl'])+'</p>'
        ],
        [
            _hdfl['HdflKsfl']['start_time'], _hdfl['HdflKsfl']['end_time'], await timeCheck(_hdfl['HdflKsfl'])
        ]
    ]
    Activys[4] = 
    [
        [
            '<h3>推广返利</h3>'+
            '<p style="margin-bottom:10px">合计邀请好友的游戏投注金豆，领取后清零，规则如下：</p>'+
            '<p>下线投注：<b>'+await numberToMoney(_hdfl['HdflXxfl']['dou'])+'</b> 豆起</p>'+
            '<p>返利比例：<b>'+_hdfl['HdflXxfl']['odd']+'</b> %</p>'+
            '<p>最高返利：<b>'+await numberToMoney(_hdfl['HdflXxfl']['max'])+'</b> 豆</p>'+
            '<p style="margin-bottom:5px">活动时间：'+_hdfl['HdflXxfl']['start_time']+' 至 '+_hdfl['HdflXxfl']['end_time']+'</p>'+
            '<p>活动状态：'+await timeCheck(_hdfl['HdflXxfl'])+'</p>'
        ],
        [
            _hdfl['HdflXxfl']['start_time'], _hdfl['HdflXxfl']['end_time'], await timeCheck(_hdfl['HdflXxfl'])
        ]
    ]
    Activys[5] = 
    [
        [
            '<h3>美女空降</h3>'+
            '<p>当月超级VIP会员 总体亏损达到100万至200万可免费享受美女空降1至3次至尊服务</p>'+
            '<p>更可有机会抽取本平台 (ID11111至99999）纯数字ID一次 88888超级ID除外。</p>'+
            '<p>活动时间：2020-09-01 00:00 至 2020-09-30 00:00</p>'
        ],
        [ 
            '2020-09-01', '2020-09-30', '已结束'
        ]
    ]
    // 
    return {
        Activys
    }
}
// 
const activym = async(d) => 
{
    const _arr = ['HdflScfl','HdflYgz','HdflTzfl','HdflKsfl','HdflXxfl'];
    let _hdfl = {};
    for(let i in _arr)
    {
        const _n = _arr[i];
        _hdfl[_n] = await get_2(_n);
    }
    //
    let ActivysM = [];
    // 
    ActivysM[0] = 
    [ 
        '首充返利',
        'ksfl.jpeg',
        _hdfl['HdflScfl']['start_time'], 
        _hdfl['HdflScfl']['end_time'], 
        await timeCheck(_hdfl['HdflScfl']),
        '<h3>首充返利</h3>'+
        '<p style="margin-bottom:10px">以每天第一笔充值为准，隔天领取，当天未领取则失效，规则如下：</p>'+
        '<div class="boe br5 table mb10"><table class="hover">'+
        '<tr><th>有效流水</th><th>返利比例</th></tr>'+
        await activy_table(_hdfl['HdflScfl']['data'],' 倍',' %')+
        '</table></div>'+
        '<p>最高返利：<b>'+await numberToMoney(_hdfl['HdflScfl']['max'])+'</b> 豆</p>'+
        '<p style="margin-bottom:5px">活动时间：'+_hdfl['HdflScfl']['start_time']+' 至 '+_hdfl['HdflScfl']['end_time']+'</p>'+
        '<p>活动状态：'+await timeCheck(_hdfl['HdflScfl'])+'</p>'
    ];
    ActivysM[1] = 
    [
        '月工资',
        'phb.jpeg',
        _hdfl['HdflYgz']['start_time'], 
        _hdfl['HdflYgz']['end_time'],
        await timeCheck(_hdfl['HdflYgz']),
        '<h3>月工资</h3>'+
        '<p style="margin-bottom:10px">合计当月有效流水，隔月领取，当月未领取则失效，规则如下：</p>'+
        '<div class="boe br5 table mb10"><table class="hover">'+
        '<tr><th>有效流水</th><th>返利金豆</th></tr>'+
        await activy_table(_hdfl['HdflYgz']['data'],'',' 豆')+
        '</table></div>'+
        '<p style="margin-bottom:5px">活动时间：'+_hdfl['HdflYgz']['start_time']+' 至 '+_hdfl['HdflYgz']['end_time']+'</p>'+
        '<p>活动状态：'+await timeCheck(_hdfl['HdflYgz'])+'</p>'
    ]
    ActivysM[2] = 
    [
        '投注返利',
        'tjhy.jpg',
        _hdfl['HdflTzfl']['start_time'], 
        _hdfl['HdflTzfl']['end_time'],
        await timeCheck(_hdfl['HdflTzfl']),
        '<h3>投注返利</h3>'+
        '<p style="margin-bottom:10px">合计当天游戏投注金豆，隔天领取，当天未领取则失效，规则如下：</p>'+
        '<p>有效流水：<b>'+_hdfl['HdflTzfl']['ls']+'</b> 倍</p>'+
        '<p>返利比例：<b>'+_hdfl['HdflTzfl']['odd']+'</b> %</p>'+
        '<p>最高返利：<b>'+await numberToMoney(_hdfl['HdflTzfl']['max'])+'</b> 豆</p>'+
        '<p style="margin-bottom:5px">活动时间：'+_hdfl['HdflTzfl']['start_time']+' 至 '+_hdfl['HdflTzfl']['end_time']+'</p>'+
        '<p>活动状态：'+await timeCheck(_hdfl['HdflTzfl'])+'</p>'
    ]
    ActivysM[3] = 
    [
        '亏损返利',
        'zks.jpeg',
        _hdfl['HdflKsfl']['start_time'],
        _hdfl['HdflKsfl']['end_time'],
        await timeCheck(_hdfl['HdflKsfl']),
        '<h3>亏损返利</h3>'+
        '<p style="margin-bottom:10px">合计当天游戏投注亏损金豆，隔天领取，当天未领取则失效，规则如下：</p>'+
        '<div class="boe br5 table mb10"><table class="hover">'+
        '<tr><th>有效流水</th><th>返利比例</th></tr>'+
        await activy_table(_hdfl['HdflKsfl']['data'],' 倍',' %')+
        '</table></div>'+
        '<p>亏损金豆：<b>'+await numberToMoney(_hdfl['HdflKsfl']['dou'])+'</b> 豆起</p>'+
        '<p>最高返利：<b>'+await numberToMoney(_hdfl['HdflKsfl']['max'])+'</b> 豆</p>'+
        '<p style="margin-bottom:5px">活动时间：'+_hdfl['HdflKsfl']['start_time']+' 至 '+_hdfl['HdflKsfl']['end_time']+'</p>'+
        '<p>活动状态：'+await timeCheck(_hdfl['HdflKsfl'])+'</p>'
    ]
    ActivysM[4] = 
    [
        '推广返利',
        'jj.jpg',
        _hdfl['HdflXxfl']['start_time'],
        _hdfl['HdflXxfl']['end_time'],
        await timeCheck(_hdfl['HdflXxfl']),
        '<h3>推广返利</h3>'+
        '<p style="margin-bottom:10px">合计邀请好友的游戏投注金豆，领取后清零，规则如下：</p>'+
        '<p>下线投注：<b>'+await numberToMoney(_hdfl['HdflXxfl']['dou'])+'</b> 豆起</p>'+
        '<p>返利比例：<b>'+_hdfl['HdflXxfl']['odd']+'</b> %</p>'+
        '<p>最高返利：<b>'+await numberToMoney(_hdfl['HdflXxfl']['max'])+'</b> 豆</p>'+
        '<p style="margin-bottom:5px">活动时间：'+_hdfl['HdflXxfl']['start_time']+' 至 '+_hdfl['HdflXxfl']['end_time']+'</p>'+
        '<p>活动状态：'+await timeCheck(_hdfl['HdflXxfl'])+'</p>'
    ]
    ActivysM[5] = 
    [
            '美女空降',
            'pngegg.png',
            '2020-09-01', 
            '2020-09-30', 
            '已结束',
            '<h3>美女空降</h3>'+
            '<p>当月超级VIP会员 总体亏损达到100万至200万可免费享受美女空降1至3次至尊服务</p>'+
            '<p>更可有机会抽取本平台 (ID11111至99999）纯数字ID一次 88888超级ID除外。</p>'+
            '<p>活动时间：2020-09-01 00:00 至 2020-09-30 00:00</p>'
    ]
    // 
    return {
        ActivysM
    }
}
// 
module.exports = {
    activy,
    activym
};