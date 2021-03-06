import { Command } from './command';
import { Workspace } from '../workspace';
import { PressDragReleaseProcessor,removeFromList } from '../../utility/common';
import { DiagramModel,DiagramNode,DiagramEdge } from '../../model/worksheet';
import { Point } from '../../model/geometry';

export class LinkNodesCommand extends Command implements PressDragReleaseProcessor{
	
	private _workspace:Workspace;
	private prepared:DiagramEdge;
	private ghostNode:DiagramNode;
	private listener:NodeLinkingStatus;
	private lastPosition:Point;

	constructor(
			workspace:Workspace,
			edge:DiagramEdge,
			ghostNode:DiagramNode,
			listener:NodeLinkingStatus){
		super();
		this._workspace=workspace;
		this.prepared=edge;
		this.ghostNode=ghostNode;
		this.listener=listener;
	}

	get workspace():Workspace{
		return this._workspace;
	}

	handleMousePress(event:MouseEvent):void{
		console.debug("link node mouse press");
		this.lastPosition=new Point(event.clientX,event.clientY);
		if(this.listener!=null){
			this.listener.beginningNodeLinkingProcess();
		}
	}
	
	handleMouseDrag(event:MouseEvent):void{
		console.debug("link node mouse drag");
		//get the delta distance
		let dx = -(this.lastPosition.x - event.clientX);
		let dy = -(this.lastPosition.y - event.clientY);
		this.lastPosition = new Point(event.clientX, event.clientY);

		//shift the ghost node which is connnected to the to point
		this.ghostNode.geometry.moveBy(new Point(dx,dy));

		//from point will follow to point
		this.prepared.fromPoint.gravitateTowards(this.prepared.toPoint.pointOnGeometry());

		//find node to connect to and notify listener
		if(this.listener!=null){
			this.listener.possibleNodeToLinkTo(this.findNodeToConnectTo());
		}
	}

	handleMouseRelease(event:MouseEvent):void{
		console.debug("link node mouse release");
		let diagramModel = this.workspace.worksheet.diagramModel

		//connect to overlapping node or ghost node if no node is overlapping
		let endpoint=this.findNodeToConnectTo();
		if(endpoint==this.ghostNode){
			//ghost node is now new node in node list
			diagramModel.nodeList.push(this.ghostNode);
		}else{
			//get a new tracking point from the existing node
			this.prepared.toPoint=endpoint.geometry.getTrackingPoint();
		}

		//make the connection and push to edge list
		this.prepared.to=endpoint;
		endpoint.incomingEdges.push(this.prepared);

		//change the style of the prepared edge's endpoint to whatever is the current preference
		this.prepared.style.fromEndpoint=this.workspace.fromEndpointPreference;
		this.prepared.style.toEndpoint=this.workspace.toEndpointPreference;
		
		this.prepared.from.outgoingEdges.push(this.prepared);
		diagramModel.edgeList.push(this.prepared);

		//the endpoint's tracking point now will gravitate Towards the 'from' node's tracking point
		this.prepared.toPoint.gravitateTowards(this.prepared.fromPoint.pointOnGeometry());

		//for a progressive behaviour, make the endpoint the new selection
		this.workspace.clearSelection();
		this.workspace.addNodeToSelection(endpoint);

		//commit to history
		this.workspace.commit(this);

		if(this.listener!=null){
			this.listener.finishedLinkingToNode(endpoint);
			this.listener=null;//nullify the reference to the listener so that we don't leak memory
		}
	}

	private findNodeToConnectTo():DiagramNode{
		let willConnectTo=this.ghostNode;
		let container=this.getFirstOverlappingNode();
		if(container!=null){
			willConnectTo=container;
		}
		return willConnectTo;
	}

	/** Returns the first overlapping node containing toPoint (starts from the back because of z order) */
	private getFirstOverlappingNode():DiagramNode{

		let nodeList=this.workspace.worksheet.diagramModel.nodeList;

		//start from back
		for(let i=nodeList.length-1;i>=0;i--){
			let node=nodeList[i];
			if(node.geometry.contains(this.prepared.toPoint.pointOnGeometry())){
				return node;
			}
		}
		return null;
	}

	execute():void{
		let diagramModel=this.workspace.worksheet.diagramModel;

		if(this.prepared.to==this.ghostNode){
			//add a new node(which was the ghost)
			diagramModel.nodeList.push(this.ghostNode);
		}
		//add prepared edge to edge list and make connections
		diagramModel.edgeList.push(this.prepared);
		this.prepared.to.incomingEdges.push(this.prepared);
		this.prepared.from.outgoingEdges.push(this.prepared)
	}

	unExecute():void{
		let diagramModel=this.workspace.worksheet.diagramModel;
		
		//remove prepared edge from edge list
		removeFromList(this.prepared,diagramModel.edgeList,"Edge is already not in edge list");

		if(this.prepared.to==this.ghostNode){
			//remove the newly created ghost node too
			removeFromList(this.ghostNode,diagramModel.nodeList,"ghost Node is already not in node list");
		}
		//remove connections
		removeFromList(this.prepared,this.prepared.to.incomingEdges,"incoming edge not found in transient list");
		removeFromList(this.prepared,this.prepared.from.outgoingEdges,"outgoing edge not found in transient list");
	}

	getName():string{
		return "Link Nodes";
	}
}

/** Listener interface for the node linking command */
export interface NodeLinkingStatus{
	/** Callback at the start of the linking process(when mouse/touch is down).*/
	beginningNodeLinkingProcess():void;
	/** Callback during the search for node in the linking process(when mouse/touch is dragged).*/
	possibleNodeToLinkTo(node:DiagramNode):void;
	/** Callback at the end of the linking process(when mouse/touch is up).*/
	finishedLinkingToNode(node:DiagramNode):void;
}