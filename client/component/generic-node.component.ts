import { Component,Input,Output,EventEmitter,ViewChildren,QueryList } from '@angular/core';
import { animate,trigger,state,style,transition } from '@angular/core';
import { Rect } from '../model/geometry';
import { Direction,PressDragReleaseProcessor } from '../utility/common';
import { ResizeHandleComponent } from './resize-handle.component';
import { DiagramNode,GenericDiagramNode } from '../model/worksheet';

//TODO move outside to a special 'variables' file 
const SELECTION_COLOR='#2BA3FC';

@Component({
	selector: 'generic-node',
	templateUrl: '../view/generic-node.component.html',
	animations: [
		trigger('selection', [
			state('selected', style({
				borderColor: "#2BA3FC"
			})),
			state('unselected', style({
				borderColor: "black"
			})),
			transition('selected => unselected', animate('100ms ease-in')),
			transition('unselected => selected', animate('100ms ease-out'))
		])
	]
})
export class GenericNodeComponent {

	@Input("soloSelected") soloSelected:boolean;
	@Input('genericNode') node:GenericDiagramNode;
	@Output() requestDragging=new EventEmitter<DiagramNode>();
	@ViewChildren(ResizeHandleComponent) resizeHandlers:QueryList<ResizeHandleComponent>;

	registerDragIntention(){
		console.debug("Registering for drag");
		this.requestDragging.emit(this.node);
	}

	updateAllResizeHandlers(resizeHandler:ResizeHandleComponent){
		this.resizeHandlers.forEach((item)=>{
			item.updateHandlePosition();
		});
	}

	editContent(event:MouseEvent){
		console.debug("Double clicked to edit content");
	}

	strokeColor(){
		return this.node.selected ? SELECTION_COLOR : this.node.stroke.hashCode();
	}
}