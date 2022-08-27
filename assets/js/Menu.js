function CreateElement(options = {}){
	let el = document.createElement(options.type || 'div');
	for(let i in options.attrs){
		let value = options.attrs[i];
		el.setAttribute(i, value);
	}

	if(options.text)
		el.innerHTML = options.text;

	return el;
}
// item: [label, childs, attrs, action, href] {icon}
function Menu(menu) {

	function MenuItem(id, options, parent){

		function to_slug(Text) {
		  return Text.toLowerCase()
		             .replace(/[^\w ]+/g, '')
		             .replace(/ +/g, '-');
		}

		let label = options.label || options[0];

		let attrs = options.attrs || options[2];

		let action = options.action || options[3];

		let href = options.href || options[4];

		let icon = options.icon;

		let target = CreateElement({ attrs: {class: 'menu-item'} });

		let el_label = CreateElement({type: 'label', text: label, attrs });

		function grand_parent(parent = self){
			if(!parent.parent)
				// return [{id: parent.id, label: parent.label, slug: parent.slug, action: parent.action}];
				return [];
			return [...grand_parent(parent.parent), {id: parent.id, label: parent.label, slug: parent.slug, action: parent.action}];
		}

		let childs = {};

		let self = {
			id, 
			label, 
			parent, 
			slug: to_slug(label), 
			target, 
			grand_parent, 
			action,
			addChild,
		}

		function addChild(menuitem){

				let el_childs = CreateElement({attrs: {
					class: 'child-item'
				}});

				target.classList.add('has-childs');
				target.appendChild(el_childs);

				el_childs.appendChild(menuitem.target);

				childs[menuitem.id] = menuitem;
		}
		function init(){

			Object.defineProperties(self, {
				grand_parent: { get: function(){ return grand_parent() } },
				target: { get: function(){ return target; } },
				addChild: { get: function(){ return addChild; } },
				childs: { get: function(){ return childs; } },
				action: { get: function(){ return function(){
					if(typeof action == 'function')
						action(self);
				}; } },
			})

			if(href)
				target = CreateElement({ type: 'a', attrs: {class: 'menu-item', href} });
			else
				target = CreateElement({ attrs: {class: 'menu-item'} });

			if(action)
				target.classList.add('has-act')

			let el_group = CreateElement({attrs: { class: 'item-info' }});
			
			if(icon){
				let el_icon;
				if(icon.includes('.'))
					el_icon = CreateElement({type: 'img', attrs: {
						class: 'menu-item-icon',
						src: icon,
						alt: label
					}})
				else
					el_icon = CreateElement({type: 'i', attrs: {
						class: `menu-item-icon ${icon}`
					}})
				el_group.classList.add('item-groups');
				el_group.appendChild(el_icon);
				el_group.appendChild(el_label);

			}
			else
				el_group.appendChild(el_label);
			target.appendChild(el_group);

			el_group.onclick = self.action;

		}
		init();

		return self;
	
	}

	let self = {data: {}, target: CreateElement()};

	function initMenu(items, parent){
		for(let i in items){
			let item = items[i];
			let childs = items[i].childs || item[1];
			let menuitem = MenuItem(i, item, parent);
			if(!parent.id)
				menuitem.target.classList.add('root-item')
			parent.target.appendChild(menuitem.target);
			self.data[menuitem.slug] = menuitem;
			if(parent.addChild)
				parent.addChild(menuitem);

			if(typeof childs == 'object')
				initMenu(childs, menuitem);
		}

		return parent;
	}

	function init(){
		initMenu(menu, self);
	}init();

	return self;

}	