<div class="widget-selectcar-order">
    <div class="order-filter">
    	<table class="filter-table">
            <tr>
                <td>预定时间</td>
                <td><input /> 至 <input /></td>
                <td rowspan="2"><button> 查询</button></td>
            </tr>
            <tr>
                <td>订单查询</td>
                <td>
                    <select>
                        <option>全部</option>
                    </select>
                </td>
            </tr>
        </table>
    </div>
    <div>
        <h2>最新订单</h2>
        <table class="new-order">
            <tr>
                <th>订单号</th>
                <th>乘车人</th>
                <th>上车时间</th>
                <th>返程时间</th>
                <th>用车目的</th>
                <th>用车方式</th>
                <th>订单状态</th>
                <th>订单金额</th>
            </tr>
            <tr>
                <td>111</td>
                <td>订单查询</td>
                <td>订单查询</td>
                <td>订单查询</td>
                <td>订单查询</td>
                <td>订单查询</td>
                <td>订单查询</td>
            </tr>
        </table>
        <div class="order-con">
            <h3>订单追踪</h3>
            <img src="/static/bigba/images/order_progress.jpg">
        </div>  
        <div class="order-con bg-gry">
            <h3>订单信息</h3>
            <table class="order-msg">
                <tr>
                    <td>乘车人：</td>
                    <td>杨晨</td>
                    <td>联系电话：</td>
                    <td>15389994748</td>
                </tr>
                <tr>
                    <td>用车方式：</td>
                    <td>会议用车</td>
                    <td>联系电话：</td>
                    <td>15389994748</td>
                </tr>
                <tr>
                    <td>车型：</td>
                    <td>51座大撤</td>
                    <td>用车费用：</td>
                    <td>375元</td>
                </tr>
                <tr>
                    <td>发车地点：</td>
                    <td>51座大撤</td>
                    <td>目的地点</td>
                    <td>375元</td>
                </tr>
                <tr>
                    <td>用车时间：</td>
                    <td>51座大撤</td>
                    <td>返程时间：</td>
                    <td>375元</td>
                </tr>
            </table>
        </div>
    </div>
</div>
{%script%}
    require("bigba:widget/usercenter/order/order.js").init();
{%/script%}
