// global, for html page
bind_element = require("../bind-element.js");
ele = require("element-tool");
add_css_text = require("./add-css-text.js");
dom_document_tool = require("dom-document-tool");

module.exports = {

	"bindElement()": function (done) {

		ele('divResult3').innerHTML =
			'<span id=sp1 class=ht-cmd onclick="alert(\'original click 1, on\')">sp1</span>';

		var ret1 = bind_element('sp1', null, ["event", "click", function () { alert("listen 1") }]);
		var ret2 = bind_element('sp1', null, "event", "click", function () { alert("listen 2") });

		if (ret1 instanceof Error) console.log(ret);
		if (ret2 instanceof Error) console.log(ret);

		var ret3 = bind_element.array('sp1', null, [
			["event", "click", function () { alert("listen 3") }],
			["event", "click", function () { alert("listen 4") }],
		]);

		console.log(ret3);
		
		return !(ret1 instanceof Error) && !(ret2 instanceof Error) && !(ret3 instanceof Error);
	},

	"bindElementArray()": function (done) {
		add_css_text(
			".ht-selected{" +
			"background:lavender;" +
			"}" +
			".ht-selected:hover{" +
			"background:#F0F0FA;" +
			"}" +
			""
		);

		ele('divResult3').innerHTML = '\
			<span name=sp-on class=ht-cmd onclick="alert(\'original click 1, on\')">on</span>, \
			<span name=sp-event class=ht-cmd onclick="alert(\'original click 2, evt\')">event</span>, <br>\
		\
			<span name=sp-attr class=ht-cmd id=sp-attr-id >attr</span>, \
			<span class=ht-cmd onclick=\'alert(myObj.attr_title)\'>get attr</span> \
			<span class=ht-cmd onclick=\'myObj.attr_title=new Date()\'>set attr</span> \
			<span class=ht-cmd onclick=\"alert(ele(\'sp-attr-id\').getAttribute( \'title\'))\">getAttribute()</span> \
			<span class=ht-cmd onclick=\"ele(\'sp-attr-id\').setAttribute( \'title\', \'attr-\'+(new Date()) )\">setAttribute()</span> <br>\
		\
			<span name=sp-attr2 class=ht-cmd id=sp-attr2-id >attr2</span>, \
			<span class=ht-cmd onclick=\'alert(myObj.attr_title)\'>get attr</span> \
			<span class=ht-cmd onclick=\"myObj.attr_title=\'attr3-\'+(new Date())\">set attr</span> \
			<span class=ht-cmd onclick=\"alert(ele(\'sp-attr2-id\').getAttribute( \'title\'))\">getAttribute()</span> \
			<span class=ht-cmd onclick=\"ele(\'sp-attr2-id\').setAttribute( \'title\', \'attr4-\'+(new Date()) )\" style=\'margin-right:2em;\'>setAttribute()</span> //bi-direction<br>\
		\
			<input name=inp1 value=111 id=inp1-id></input>, \
			<span class=ht-cmd onclick=\'alert(myObj.inp_v)\'>get v</span> \
			<span class=ht-cmd onclick=\"myObj.inp_v=\'v-\'+(new Date())\">set v</span> \
			<span class=ht-cmd onclick=\"alert(ele(\'inp1-id\').value)\">get prop</span> \
			<span class=ht-cmd onclick=\"ele(\'inp1-id\').value= \'v2-\'+(new Date());dom_document_tool.dispatchEventByName(\'inp1-id\',\'change\')\" style=\'color:gray;\' title=\'no effect\'>set prop+dispatchEvent()</span> <br>\
		\
			<input name=inp2 value=222 id=\'inp2-id\'></input>, \
			<span class=ht-cmd onclick=\'alert(myObj.inp_v)\'>get v</span> \
			<span class=ht-cmd onclick=\"myObj.inp_v=\'v3-\'+(new Date())\">set v</span> \
			<span class=ht-cmd onclick=\"alert(ele(\'inp2-id\').value)\">get prop</span> \
			<span class=ht-cmd onclick=\"ele(\'inp2-id\').value= \'v4-\'+(new Date());dom_document_tool.dispatchEventByName(\'inp2-id\',\'change\')\" style=\'color:gray;margin-right:2em;\' title=\'effective, but not recommend, and had better use [set v]\'>set prop+dispatchEvent(change)</span>  //bi-direction<br>\
		\
			<input name=inp3 value=333 id=\'inp3-id\'></input>, \
			<span class=ht-cmd onclick=\'alert(myObj.inp_v)\'>get v</span> \
			<span class=ht-cmd onclick=\"myObj.inp_v=\'v5-\'+(new Date())\">set v</span> \
			<span class=ht-cmd onclick=\"alert(ele(\'inp3-id\').value)\">get prop</span> \
			<span class=ht-cmd onclick=\"ele(\'inp3-id\').value= \'v6-\'+(new Date());dom_document_tool.dispatchEventByName(\'inp3-id\',\'input\')\" style=\'color:gray;margin-right:2em;\' title=\'effective, but not recommend, and had better use [set v]\'>set prop+dispatchEvent(input)</span>  //\'input\' event<br>\
		\
			<input name=inp4 value=444 id=\'inp4-id\'></input>, \
			<span class=ht-cmd onclick=\'alert(myObj.inp_v)\'>get v</span> \
			<span class=ht-cmd onclick=\"myObj.inp_v=\'v7-\'+(new Date())\">set v</span> \
			<span class=ht-cmd onclick=\"alert(ele(\'inp4-id\').value)\">get prop</span> \
			<span class=ht-cmd onclick=\"ele(\'inp4-id\').value= \'v8-\'+(new Date());\" style=\'margin-right:2em;\' title=\'effective\'>set prop</span>  //watchJs<br>\
		\
			<span name=sp-html id=sp-html-id >5555</span>, \
			<span class=ht-cmd onclick=\"ele(\'sp-html-id\').innerHTML=\'<b>hhhh</b> \'+(new Date())\" style=\'margin-right:2em;\'>set</span> //innerHTML<br>\
		\
			<span name=sp-text id=sp-text-id >666</span>, \
			<span class=ht-cmd onclick=\"ele(\'sp-text-id\').textContent=\'<b>ttt</b> \'+(new Date())\" style=\'margin-right:2em;\'>set</span>  //textContent<br>\
		\
			<span name=sp-display id=sp-display-id >777</span>, \
			<span class=ht-cmd onclick=\'alert(myObj.dis_v)\'>get v</span> \
			<span class=ht-cmd onclick=\"myObj.dis_v=\'none\'\">set v1=none</span> \
			<span class=ht-cmd onclick=\"myObj.dis_v=\'\'\">set v1=</span> \
			<span class=ht-cmd onclick=\"alert(ele(\'sp-display-id\').style.display)\">get style</span> \
			<span class=ht-cmd onclick=\"ele(\'sp-display-id\').style.display= \'none\';\">set style=none</span> \
			<span class=ht-cmd onclick=\"ele(\'sp-display-id\').style.display= \'\';\">set style=</span> <br>\
		\
			<label><input name=sp-display-chk id=\'sp-display-chk-id\' type=checkbox ></input> hide</label> \
			<label><input name=sp-display-chk2 id=\'sp-display-chk2-id\' type=checkbox ></input> show</label>\
			<span class=ht-cmd onclick=\"ele(\'sp-display-chk2-id\').checked=true\">set true</span>\
			<span class=ht-cmd onclick=\"ele(\'sp-display-chk2-id\').checked=false\">set false</span> <br>\
		\
			<span name=sp-display2 id=sp-display2-id >888</span>, \
			<span class=ht-cmd onclick=\'alert(myObj.dis_v2)\'>get v</span> \
			<span class=ht-cmd onclick=\"myObj.dis_v2=true\">set v2=true</span> \
			<span class=ht-cmd onclick=\"myObj.dis_v2=false\">set v2=fase</span> \
			<span class=ht-cmd onclick=\"alert(ele(\'sp-display2-id\').style.display)\">get style</span> \
			<span class=ht-cmd onclick=\"ele(\'sp-display2-id\').style.display= \'none\';\">set style=none</span> \
			<span class=ht-cmd onclick=\"ele(\'sp-display2-id\').style.display= \'\';\" style=\'margin-right:2em;\'>set style=</span>  //boolean value<br>\
		\
			<label><input name=sp-display2-chk id=\'sp-display2-chk-id\' type=checkbox ></input> hide</label> \
			<label><input name=sp-display2-chk2 id=\'sp-display2-chk2-id\' type=checkbox ></input> show</label>\
			<span class=ht-cmd onclick=\"ele(\'sp-display2-chk2-id\').checked=true\">set true</span>\
			<span class=ht-cmd onclick=\"ele(\'sp-display2-chk2-id\').checked=false\">set false</span><br>\
		\
			<span name=sp-cls id=sp-cls-id >999</span>, \
			<span class=ht-cmd onclick=\'alert(myObj.cls_v)\'>get v</span> \
			<span class=ht-cmd onclick=\"myObj.cls_v=true\">set v=true</span> \
			<span class=ht-cmd onclick=\"myObj.cls_v=false\">set v=false</span> \
			<span class=ht-cmd onclick=\"alert(ele(\'sp-cls-id\').className)\">get className</span> \
			<span class=ht-cmd onclick=\"ele(\'sp-cls-id\').className= \'ht-selected\';\">set className=ht-selected</span> \
			<span class=ht-cmd onclick=\"ele(\'sp-cls-id\').className= \'\';\">set className=</span> <br>\
		\
			<span name=sp-cls2 id=sp-cls2-id >aaa</span>, \
			<span class=ht-cmd onclick=\'alert(myObj.cls2_v)\'>get v</span> \
			<span class=ht-cmd onclick=\"myObj.cls2_v=true\">set v=true</span> \
			<span class=ht-cmd onclick=\"myObj.cls2_v=false\">set v=false</span> \
			<span class=ht-cmd onclick=\"alert(ele(\'sp-cls2-id\').className)\">get className</span> \
			<span class=ht-cmd onclick=\"ele(\'sp-cls2-id\').className= \'ht-selected\';\">set className=ht-selected</span> \
			<span class=ht-cmd onclick=\"ele(\'sp-cls2-id\').className= \'\';\" style=\'margin-right:2em;\'>set className=</span> //not<br>\
		\
			<span name=sp-cls3 id=sp-cls3-id >bbb</span>, \
			<span class=ht-cmd onclick=\'alert(myObj.cls3_v)\'>get v</span> \
			<span class=ht-cmd onclick=\"myObj.cls3_v=\'state aa\'\">set state=aa</span> \
			<span class=ht-cmd onclick=\"myObj.cls3_v=\'state bb\'\">set state=bb</span> \
			<span class=ht-cmd onclick=\"alert(ele(\'sp-cls3-id\').className)\">get className</span> \
			<span class=ht-cmd onclick=\"ele(\'sp-cls3-id\').className= \'ht-selected\';\">set className=ht-selected</span> \
			<span class=ht-cmd onclick=\"ele(\'sp-cls3-id\').className= \'\';\" style=\'margin-right:2em;\'>set className=</span> //string<br>\
			<span name=sp-cls3-txt >bbb</span> <br>\
		<br><br><br>';

		var myObj = {
			func1: function () { alert('func1'); },
			attr_title: 'aaaaaa',
			inp_v: 'bbb',
			dis_v: '',
			dis_v2: false,
			cls_v: false,
			cls2_v: false,
			cls3_v: 'state aa',
		};
		window.myObj = myObj;

		var myConfig = [
			'sp-on', ['on', 'click', 'func1'],
			'sp-event',
			['event', 'click', 'func1'],
			[, , function () { alert('inline func3') }],
			'sp-attr', ['attr', 'title', 'attr_title'],
			'sp-attr2',
			['attr', 'title', 'attr_title', true],		//bi-direction
			[, , function () { alert('inline func attr2') }],
			'inp1', ['prop', 'value', 'inp_v'],
			'inp2', ['prop', 'value', 'inp_v', true /* { biDirection:true } */],		//bi-direction
			'inp3', ['prop', 'value', 'inp_v', 'input' /* { notifyEvent:'input' } */], 		//'input' event
			'inp4', ['prop', 'value', 'inp_v', 0x2 /* { watchJs:true } */], 		//watchJs

			'sp-html', ['prop', 'innerHTML', 'inp_v', 0x2 /* { watchJs:true } */], 		//watchJs
			'sp-text', ['prop', 'textContent', 'inp_v', 0x2 /* { watchJs:true } */], 		//watchJs

			'sp-display', ['style', 'display', 'dis_v', true],
			'sp-display-chk', ['prop', 'checked', 'dis_v', { bi: true, map: { true: 'none', false: '' } }],
			'sp-display-chk2', ['prop', { item: 'checked', map: { '': true, 'none': false } }, 'dis_v', { bi: true, watch: true, map: { true: '', false: 'none' } }],

			'sp-display2', ['style', { typeItem: 'display', map: { false: 'none', true: '' } }, 'dis_v2', { biDirection: true, map: { 'none': false, '': true } }],
			'sp-display2-chk', ['prop', { typeItem: 'checked', map: { true: false, false: true } }, 'dis_v2', { biDirection: true, map: { true: false, false: true } }],
			'sp-display2-chk2', ['prop', 'checked', 'dis_v2', 0x2],

			'sp-cls', ['class', 'ht-selected', 'cls_v', true],
			'sp-cls2', ['class', { item: 'ht-selected', map: { true: false, false: true } }, 'cls2_v', { bi: true, map: { true: false, false: true } }],
			'sp-cls3', ['class', { item: 'ht-selected', map: function (v) { console.log(v); return v.indexOf('aa') > 0; } }, 'cls3_v', { bi: true, map: function (v) { console.log('js', v); return 'state ' + (v ? 'aa' : 'bb'); } }],
			'sp-cls3-txt', ['prop', 'textContent', 'cls3_v',],
		];

		var ret = bind_element.array('divResult3', myObj, myConfig);
		if (ret instanceof Error) console.log(ret);
		return !(ret instanceof Error);
	},

};

// for html page
//if (typeof setHtmlPage === "function") setHtmlPage("title", "10em", 1);	//page setting
if (typeof showResult !== "function") showResult = function (text) { console.log(text); }

//for mocha
if (typeof describe === "function") describe('mocha-test', function () { for (var i in module.exports) { it(i, module.exports[i]); } });
