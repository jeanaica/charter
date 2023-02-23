import { ParseParams, z } from 'zod';
import {
  CoordinateExtent,
  HandleElement,
  internalsSymbol,
  Node as _Node,
  NodeHandleBounds,
  Position,
  XYPosition,
} from 'reactflow';

import { ComponentNodeDataType, SubsystemNodeDataType } from './nodeTypes';

// helper schemas for the more troublesome interfaces
const _XYPosition: z.ZodType<XYPosition> = z.object({
  x: z.number(),
  y: z.number(),
});
const _CoordinateExtent: z.ZodType<CoordinateExtent> = z.tuple([
  z.tuple([z.number(), z.number()]),
  z.tuple([z.number(), z.number()]),
]);
const _HandleElement: z.ZodType<HandleElement> = z
  .object({
    id: z.string().nullable().optional(),
    position: z.nativeEnum(Position),
    width: z.number(),
    height: z.number(),
  })
  .and(_XYPosition);
const NodeData = z.union([ComponentNodeDataType, SubsystemNodeDataType]);
const _NodeHandleNounds: z.ZodType<NodeHandleBounds> = z.object({
  source: _HandleElement.array().nullable(),
  target: _HandleElement.array().nullable(),
});
const partialProps = z.object({
  type: z.string(),
  style: z.record(z.any()),
  className: z.string(),
  targetPosition: z.nativeEnum(Position),
  sourcePosition: z.nativeEnum(Position),
  hidden: z.boolean(),
  selected: z.boolean(),
  dragging: z.boolean(),
  draggable: z.boolean(),
  selectable: z.boolean(),
  connectable: z.boolean(),
  dragHandle: z.string(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  parentNode: z.string(),
  zIndex: z.number(),
  extent: z.literal('parent').or(_CoordinateExtent),
  expandParent: z.boolean(),
  positionAbsolute: _XYPosition,
  [internalsSymbol]: z
    .object({
      z: z.number(),
      handleBounds: _NodeHandleNounds, // not something we use, no problem left untyped
      isParent: z.boolean(),
    })
    .optional(),
});
//ComponentNode = regular ol' Node object
//SubsystemNode = container Node, that outline thingy

//register the zod schemas for each of the nodes here to get it typed
type NodeData = z.infer<typeof NodeData>;
export const Node: z.ZodType<_Node<NodeData>> = z
  .object({
    id: z.string(), // for react-flow-renderer
    position: _XYPosition,
    data: NodeData, // this is important later
  })
  .merge(partialProps.partial());
export type Node = z.output<typeof Node>;
