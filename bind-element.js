
// bind-element @ npm, make binding between dom element and js object.

"use strict";

var formatError = require("format-error-tool");
var ele = require("ele-tool");
var ele_id = require("ele-id");
var query_by_name_path = require("query-by-name-path");

var script_tool = require("script-tool");
var findWithFilter = script_tool.findWithFilter,
	mapValue = script_tool.mapValue,
	enclosePropertyDescriptor = script_tool.enclosePropertyDescriptor;

var dom_document_tool = require("dom-document-tool");
var observeSingleMutation = dom_document_tool.observeSingleMutation,
	dispatchEventByName = dom_document_tool.dispatchEventByName;

/*
	bind item:
		an array to configure element binding,
		[ "type", typeOption, member, memberOption ]	//basic format
		where type and typeOption is related to dom object, 
		member and memberOption is related to js object.
		
		or shortcut format,
		[ "type", typeOption | "typeItem", member, memberOption | .biDirection/0x1 | ".notifyEvent" | .watchJs/0x2 ]	//shortcut format
		
			"type"
				dom type string, "on/event|evt/attr/style|css/class/prop|property"
			
			typeOption
				dom type option
				
				".typeItem" / ".item"
					dom type sub-item string;
					shortcut argument is a string;
				
				.valueMapper / .map
					a value mapper for setting dom item, refer to mapValue().
			
			member
				js member
					"propertyName" | "methodName" | function;
			
			memberOption
				js member option
				
				.biDirection / .bi
					set true to bind both from js to dom and from dom to js;
					if not set, bind in default way;
					shortcut argument is a boolean value, or a number value contain 0x1;
					
				.notifyEvent / .notify
					set name string of bi-direction notify event ( will automatically set biDirection=true );
					if not set, use default event "change";
					shortcut argument is a string;
				
				.watchJs / .watch
					if set true, for type "prop", watch dom property change from js ( will automatically set biDirection=true ).
					shortcut argument is a number value contain 0x2;
				
				.valueMapper / .map
					a value mapper for setting js member, refer to mapValue().
				
		type format:
			
			"on":
				event binding by setting GlobalEventHandlers[ "on" + typeItem ],
				
					[ "on", "click", "methodName" | function, extraArgument ]
			
			"evt|event":
				event binding by addEventListener()
				
					[ "event|evt", "click", "methodName" | function, extraArgument={ listenerOptions } ]
			
			"attr":
				attribute binding,
				
					[ "attr", "title", "propertyName", extraArgument={ biDirection } ]
					[ "attr", "title", "methodName" | function, extraArgument ]		//refer to MutationRecord
			
			"css|style":
				style binding
				
					[ "style", "display", "propertyName", extraArgument={ biDirection } ]
					[ "style", "display", "methodName" | function, extraArgument ]		//will also evoke on any other style change; refer to MutationRecord; 
			
			"class":
				element class binding. default binding member is boolean type.
				
					[ "class", "myClass", "propertyName", extraArgument={ biDirection } ]
					[ "class", "myClass", "methodName" | function, extraArgument ]		//will also evoke on any other class change; refer to MutationRecord;
			
			"prop|property":
				property binding,
				
					[ "prop", "value", "propertyName", extraArgument={ notifyEvent, biDirection, watchJs } ]
					[ "prop", "value", "methodName" | function, extraArgument={ notifyEvent, watchJs, listenerOptions } ]
*/

//bind-item index constant
var BI_TYPE = 0,
	BI_TYPE_OPTION = 1,
	BI_MEMBER = 2,
	BI_MEMBER_OPTION = 3;

//bindElement(el, obj, bindItem) or
//bindElement(el, obj, "type", typeOption, member, memberOption )
//return Error if fail, or `true` if success
var bindElement = function (el, obj, bindItem) {

	//-------------------------------------
	//arguments

	el = ele(el);
	var elId = ele_id(el);

	if (typeof bindItem === "string") bindItem = Array.prototype.slice.call(arguments, 2);

	//type
	var type = bindItem[BI_TYPE];

	//typeItem, typeOption
	var typeOption = bindItem[BI_TYPE_OPTION], typeItem, domValueMapper;
	if (typeof typeOption === "string") { typeItem = typeOption; typeOption = null; }
	else {
		typeItem = typeOption.typeItem || typeOption.item;
		domValueMapper = typeOption.valueMapper || typeOption.map;
	}

	if (!typeItem) return formatError("bind typeItem empty", bindItem);

	//member
	var member = bindItem[BI_MEMBER];

	var memberValue;
	if (typeof member === "function") { memberValue = member; }
	else if (member in obj) { memberValue = obj[member]; }
	else return formatError("member unfound", member, bindItem);

	var memberIsFunction = (typeof memberValue === "function");
	var memberThis = (!memberIsFunction || (memberValue !== member)) ? obj : null;

	//memberOption
	var memberOption = bindItem[BI_MEMBER_OPTION], biDirection, notifyEvent, watchJs, jsValueMapper;
	var typeofMo = typeof memberOption;

	if (typeofMo === "boolean") { biDirection = memberOption; memberOption = null; }
	else if (typeofMo === "number") {
		biDirection = memberOption & 0x1;
		watchJs = memberOption & 0x2;
		memberOption = null;
	}
	else if (typeofMo === "string") {
		if (memberOption) { notifyEvent = memberOption; memberOption = null; }
	}
	else if (memberOption) {
		notifyEvent = memberOption.notifyEvent || memberOption.notify;
		biDirection = notifyEvent || memberOption.biDirection || memberOption.bi;
		watchJs = memberOption.watchJs || memberOption.watch;
		jsValueMapper = memberOption.valueMapper || memberOption.map;
	}
	if (!biDirection && (notifyEvent || watchJs)) biDirection = true;

	//-------------------------------------
	//bind event
	if (type == "on" || type == "event" || type == "evt") {
		if (!memberIsFunction) return formatError("bind member is not a function", member, bindItem);

		var bindFunc = function (evt) { return memberValue.apply(memberThis || this, [evt, memberOption]); };

		if (type == "on") { el["on" + typeItem] = bindFunc; }
		else { el.addEventListener(typeItem, bindFunc, memberOption && memberOption.listenerOptions); }

		return true;
	}

	//-------------------------------------
	//bind attribute group
	if (type === "attr" || type === "style" || type === "css" || type === "class") {
		//bind attribute event
		if (memberIsFunction) {
			var attrName = (type === "attr") ? typeItem : type;
			if (attrName === "css") attrName = "style";

			observeSingleMutation(el, attrName,
				function (mutationItem) { return memberValue.apply(memberThis || this, [mutationItem, memberOption]); }
			);
			return true;
		}

		var v0;
		if (type === "attr") {		//bind attribute
			//variable member
			v0 = findWithFilter(null, memberValue, mapValue(jsValueMapper, el.getAttribute(typeItem) || ""), "");

			enclosePropertyDescriptor(obj, member,
				function (v) {
					v = "" + mapValue(domValueMapper, v);
					if (ele(elId).getAttribute(typeItem) !== v) ele(elId).setAttribute(typeItem, v);
				},
				function () { return mapValue(jsValueMapper, ele(elId).getAttribute(typeItem)); }
			);

			if (biDirection) {
				observeSingleMutation(el, typeItem,
					function (mutationItem) { obj[member] = mapValue(jsValueMapper, mutationItem.target.getAttribute(mutationItem.attributeName) || ""); }
				);
			}
		}
		else if (type === "style" || type === "css") {		//bind style
			//variable member
			var v0 = findWithFilter(null, memberValue, mapValue(jsValueMapper, el.style[typeItem] || ""), "");

			enclosePropertyDescriptor(obj, member,
				function (v) {
					v = "" + mapValue(domValueMapper, v);
					if (ele(elId).style[typeItem] !== v) ele(elId).style[typeItem] = v;
				},
				function () { return mapValue(jsValueMapper, ele(elId).style[typeItem]); }
			);

			if (biDirection) {
				observeSingleMutation(el, "style",
					function (mutationItem) { obj[member] = mapValue(jsValueMapper, mutationItem.target.style[typeItem] || ""); }
				);
			}
		}
		else if (type === "class") {		//bind class
			//variable member
			var v0 = findWithFilter(null, memberValue, mapValue(jsValueMapper, el.classList.contains(typeItem)), false);

			enclosePropertyDescriptor(obj, member,
				function (v) {
					v = !!mapValue(domValueMapper, v);
					if (v && !ele(elId).classList.contains(typeItem)) ele(elId).classList.add(typeItem);
					else if (!v && ele(elId).classList.contains(typeItem)) ele(elId).classList.remove(typeItem);
				},
				function () { return mapValue(jsValueMapper, ele(elId).classList.contains(typeItem)); }
			);

			if (biDirection) {
				observeSingleMutation(el, "class",
					function (mutationItem) { obj[member] = mapValue(jsValueMapper, mutationItem.target.classList.contains(typeItem)); }
				);
			}
		}

		//init value
		obj[member] = v0;

		return true;
	}

	//-------------------------------------
	//bind property
	if (type === "prop" || type === "property") {
		if (!(typeItem in el)) return formatError("bind property unfound", typeItem, bindItem);

		//function binding
		if (memberIsFunction) {
			var bindFunc = function (evt) { return memberValue.apply(memberThis || this, [evt, memberOption]); };
			el.addEventListener(notifyEvent || "change", bindFunc, memberOption && memberOption.listenerOptions);
			if (watchJs) {
				enclosePropertyDescriptor(el, typeItem,
					function (v) { dispatchEventByName(elId, notifyEvent || "change", 0); }
				);
			}
			return true;
		}

		//variable member
		var v0 = findWithFilter(null, memberValue, mapValue(jsValueMapper, el[typeItem] || ""));

		enclosePropertyDescriptor(obj, member,
			function (v) {
				v = mapValue(domValueMapper, v);
				if (ele(elId)[typeItem] != v) ele(elId)[typeItem] = v;
			},
			function () { return mapValue(jsValueMapper, ele(elId)[typeItem]); }
		);

		if (biDirection) {
			el.addEventListener(notifyEvent || "change", function (evt) { obj[member] = mapValue(jsValueMapper, ele(elId)[typeItem]); }, memberOption && memberOption.listenerOptions);
		}
		if (watchJs) {
			enclosePropertyDescriptor(el, typeItem,
				function (v) { dispatchEventByName(elId, notifyEvent || "change", 0); }
			);
		}

		//init value
		obj[member] = v0;

		return true;
	}

	return formatError("unknown bind type", type, bindItem);
}

/*
	bind item array:
		an array of bindItem/namePath, that is,
			[ bindItem|namePath, bindItem|namePath, ...  ]
		
		* namePath: refer query-by-name-path @ npm

		* the default namePath is "", for the entry element. 
*/

//return an object mapping namePath to dom id if success.
//return Error if fail.
var bindElementArray = function (el, obj, bindItemArray) {
	el = ele(el);

	var elLast = el, lastName = "";
	var i, imax = bindItemArray.length, bi, ret, namePath, lastBi;

	var nm = {			//name mapping;
		"": ele_id(elLast)	//map "" to entry element
	};

	for (i = 0; i < imax; i++) {
		bi = bindItemArray[i];
		if (typeof bi === "string") {
			namePath = bi;

			elLast = query_by_name_path(el, namePath);
			if (!elLast) return formatError("bind name path unfound", namePath, bi);
			nm[namePath] = ele_id(elLast);
			lastName = namePath;
			continue;
		}
		else if (!(bi instanceof Array)) return formatError("bindItem is not an array", namePath, bi);
		else if (i) {
			//copy other omitted item from previous value
			if (!bi[BI_TYPE] && ((lastBi = bindItemArray[i - 1]) instanceof Array)) {
				bi[BI_TYPE] = lastBi[BI_TYPE];	//fill back omitted "type"
				if (!bi[BI_TYPE_OPTION])
					bi[BI_TYPE_OPTION] = lastBi[BI_TYPE_OPTION];	//fill back omitted typeOption | "typeItem"
			}
		}

		ret = bindElement(elLast, obj, bi);
		if (ret instanceof Error) return ret;
	}
	return nm;
}

// module

module.exports = exports = bindElement;

exports.bindElement = bindElement;
exports.bindElementArray = bindElementArray;
exports.array = bindElementArray;
