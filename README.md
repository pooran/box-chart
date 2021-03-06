# Type Diagram
Type Diagram (a.k.a _Box Chart_) is a digaramming tool provided as an Office Add-in. Here's the [Youtube trailer](https://www.youtube.com/watch?v=VBiDAGlPD0k)

## An Office add in
Type diagram is both intuitive and fast. Like really fast. Like "create binary tree in mere seconds fast".  Type Diagram was built with the understanding that using existing diagramming solutions takes just too long. 

By design, you get to choose one of two shapes that you create from: Rectangle or Circle (more shapes coming soon). Think of these shapes as nodes in your graph. Which means they can be connected via edges. You can write on your nodes and edges but what really makes this super flexibly is that all nodes and edges are mutable, meaning you can change any property of a node while still retaining its content and connections. You can change a node's shape, outline and content. 

![Mutable Rectangles and Circles](resource-development/demos/shape-outline.gif)

Similarly for an edge, you can change arrowheads for its endpoints, its label and its dashing. You can create new conneted nodes by simply selecting a node and clicking on its _linking_ endpoint.

![Simple class diagram](resource-development/demos/simple-classes.gif)

Select multiple nodes together to move (or delete them). Press shift to make more precise selections

![Selection and movement](resource-development/demos/select-move.gif)

Since your diagrams can crossover the bounds of the add in, you can hold space and drag to pan

![Panning](resource-development/demos/panning.gif)

On top of this Type Diagram provides several other useful features like autosaving, undo-redo, multiple selection, ghost nodes, auto generated node content, edge endpoint preference and common sense hotkeys.
With the idea of a better user experience, I hope that this tool empowers diagrammers everywhere.

### Status 
I will be launching this Add-in soon. If you are interested, please star this project. Thanks

### Instructions for running

1. Make sure you have node installed (check with node -v)
2. Install [OrientDB community edition](http://orientdb.com/download/) and follow the step to run the server with default configurations.
2. __npm install__
3. __npm start__ (or alternatively, if gulp is installed globally : _gulp start:server_ and _gulp start:client_ in 2 separate terminal windows)
4. The very first run may lead to some errors (because of fresh typescript transpiling).
 Thats okay, running second time onwards should work just fine.
5. Since the app runs on https, you will have to create a root certificate for your OS and place both the private key and the certificate key under **server/dev-purposes-certs**. 
6. The private key must be named rootCA.key and the certificate key must be named rootCA.pem
6. Go to https://localhost:3000
7. To make this work inside Powerpoint (or Word), you will have to [sideload this add-in](https://dev.office.com/docs/add-ins/testing/sideload-an-office-add-in-on-ipad-and-mac) by placing the _[manifest](resource-development/type-diagram.xml)_ file under the following location.
`/Users/<username>/Library/Containers/com.microsoft.Powerpoint/Data/documents/wef` 

## [Vote for me](https://devpost.com/software/type-diagram)

Type Diagram was submitted in Microsoft's HackProductivity 2017. If you think this tool will be useful for someone, you can [vote for me](https://devpost.com/software/type-diagram) for the popular choice award.
