<div class="widget-selectcar-usecar" id="widget-selectcar-usecar">
    <form action="order/car_information_action">
    <div class="tit-con">
    	用车信息
    </div>
    <div class="divider"></div>
    <div class="content-box">
        <div class="item-box">
            <table class="item-table">
                <tr>
                    <th>车辆</th>
                    <th>车型</th>
                    <th>数量</th>
                </tr>
                <tr>
                    <td class="tb-img">
                        <img src="/static/bigba/images/sc-bigpic.jpg" width="300" height="200" />
                    </td>
                    <td><div class="tb-con">51座大型宇通客车</div></td>
                    <td>
                    <div class="tb-con" data-node="selectNum">
                        <span data-node="minus">-</span>
                        <input size="2" value="0" data-node="input">
                        <span data-node="add">+</span>
                    </div>
                    </td>
                </tr>
                <tr>
                    <td class="tb-img">
                        <img src="/static/bigba/images/sc-bigpic.jpg" width="300" height="200" />
                    </td>
                    <td><div class="tb-con">51座大型宇通客车</div></td>
                    <td>
                        <div class="tb-con" data-node="selectNum">
                        <span data-node="minus">-</span>
                        <input size="2" value="0" data-node="input">
                        <span data-node="add">+</span>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <div class="item-box">
            <label>出发地点</label>
            <select>
                <option value="131">北京</option>
            </select>
            <input placeholder="出发地点" size="40" />
            <!-- <select placeholder="出发地点">
                <option></option>
            </select> -->
        </div>
        <div class="item-box">
            <label>到达地点</label>
            <select>
                <option value="131">北京</option>
            </select>
            <input placeholder="到达地点" size=40 />
            <!-- <select placeholder="到达地点">
                <option></option>
            </select> -->
        </div>
        <div class="item-box" data-node="carway">
            <label>用车方式:</label>
            <label class=""><input type="radio" name="carway" value="1" checked/>单程</label>
            <label class=""><input type="radio" name="carway" value="2"/>往返</label>
        </div>
        <div class="item-box">
            <label data-node="from_date">发车时间
                <input name="from_date" id="from_date" placeholder="出发地点" />
                <select name="from_date_time">
                    <option>00:00</option>
                    <option>00:30</option>
                    <option>01:00</option>
                    <option>01:30</option>
                    <option>02:00</option>
                    <option>02:30</option>
                    <option>03:00</option>
                    <option>03:30</option>
                    <option>04:00</option>
                    <option>04:30</option>
                    <option>05:00</option>
                    <option>05:30</option>
                    <option>06:00</option>
                    <option>06:30</option>
                    <option>07:00</option>
                    <option>07:30</option>
                    <option>08:00</option>
                    <option>08:30</option>
                    <option>09:00</option>
                    <option>09:30</option>
                    <option>10:00</option>
                    <option>10:30</option>
                    <option>12:00</option>
                    <option>12:30</option>
                    <option>13:00</option>
                    <option>13:30</option>
                    <option>14:00</option>
                    <option>14:30</option>
                    <option>15:00</option>
                    <option>15:30</option>
                    <option>16:00</option>
                    <option>16:30</option>
                    <option>17:00</option>
                    <option>17:30</option>
                    <option>18:00</option>
                    <option>18:30</option>
                    <option>19:00</option>
                    <option>19:30</option>
                    <option>20:00</option>
                    <option>20:30</option>
                    <option>21:00</option>
                    <option>21:30</option>
                    <option>22:00</option>
                    <option>22:30</option>
                    <option>23:00</option>
                    <option>23:30</option>
                </select>
            </label>
            <label data-node="back_date" class="disable">返程时间
                <input name="back_date"  id="back_date" placeholder="到达地点" disabled="disabled" />
                <select name="back_date_time" disabled="disabled">
                    <option>00:00</option>
                    <option>00:30</option>
                    <option>01:00</option>
                    <option>01:30</option>
                    <option>02:00</option>
                    <option>02:30</option>
                    <option>03:00</option>
                    <option>03:30</option>
                    <option>04:00</option>
                    <option>04:30</option>
                    <option>05:00</option>
                    <option>05:30</option>
                    <option>06:00</option>
                    <option>06:30</option>
                    <option>07:00</option>
                    <option>07:30</option>
                    <option>08:00</option>
                    <option>08:30</option>
                    <option>09:00</option>
                    <option>09:30</option>
                    <option>10:00</option>
                    <option>10:30</option>
                    <option>12:00</option>
                    <option>12:30</option>
                    <option>13:00</option>
                    <option>13:30</option>
                    <option>14:00</option>
                    <option>14:30</option>
                    <option>15:00</option>
                    <option>15:30</option>
                    <option>16:00</option>
                    <option>16:30</option>
                    <option>17:00</option>
                    <option>17:30</option>
                    <option>18:00</option>
                    <option>18:30</option>
                    <option>19:00</option>
                    <option>19:30</option>
                    <option>20:00</option>
                    <option>20:30</option>
                    <option>21:00</option>
                    <option>21:30</option>
                    <option>22:00</option>
                    <option>22:30</option>
                    <option>23:00</option>
                    <option>23:30</option>
                </select>
            </label>
        </div>
    </div>
    <div class="tit-con">
        附加服务
    </div>
    <div class="content-box">
        <div class="item-box blacktips" data-node="blacktips">
            <span class="blacktip">人身意外险<em class="corner"></em></span>
            <span class="blacktip">随车导游<em class="corner"></em></span>
            <span class="blacktip">瓶装饮用水<em class="corner"></em></span>
            <span class="blacktip">随车零食<em class="corner"></em></span>
        </div>
        <input data-node="selecttip" name="selecttip" value="">
    </div>
    <div class="summary-bar">
        <div>
            <span>预估车费：</span>
            <span>
                ￥1500元
            </span>
            <button class="nextbtn" data-node="nextBtn">下一步</button>
        </div>
    </div>
    </form>
</div>
{%script%}
    (require("bigba:widget/selectcar/usecar/usecar.js")).createWidget();
{%/script%}
