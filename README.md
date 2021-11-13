# bind-element
make binding between dom element and js object

# Install
```
npm install bind-element
```

# Usage & Api
```javascript

var bind_element = require("bind-element");

ele('divResult3').innerHTML =
	'<span id=sp1 class=ht-cmd onclick="alert(\'original click 1, on\')">sp1</span>';

//bindElement(el, obj, bindItem) or
//bindElement(el, obj, "type", typeOption, member, memberOption )
//return Error if fail, or `true` if success
var ret1 = bind_element('sp1', null, ["event", "click", function () { alert("listen 1") }]);
var ret2 = bind_element('sp1', null, "event", "click", function () { alert("listen 2") });

assert( !(ret1 instanceof Error) && !(ret2 instanceof Error) );

/*
	bind item array:
		an array of bindItem/namePath, that is,
			[ bindItem|namePath, bindItem|namePath, ...  ]
		
		* namePath: refer query-by-name-path @ npm

		* the default namePath is "", for the entry element. 
*/

//return an object mapping namePath to dom id if success.
//return Error if fail.
//.bindElementArray(el, obj, bindItemArray)
var ret3 = bind_element.array('sp1', null, [
	["event", "click", function () { alert("listen 3") }],
	["event", "click", function () { alert("listen 4") }],
]);
assert( !(ret3 instanceof Error) );

console.log(ret3);

```

# Document
```
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

```