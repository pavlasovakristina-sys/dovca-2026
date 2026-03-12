import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Activity } from "../../types";
import { ActivityCard } from "../ActivityCard";

interface ActivityListProps {
  activities: Activity[];
  dayId: string;
  onMoreClick: (activityId: string) => void;
  onReorder: (activityId: string, toIndex: number) => void;
}

function SortableActivityCard({
  activity,
  onMoreClick,
}: {
  activity: Activity;
  onMoreClick: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: activity.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragHandle = (
    <span
      {...attributes}
      {...listeners}
      className="text-slate-300 cursor-grab active:cursor-grabbing select-none"
      aria-label="Přetáhnout pro změnu pořadí"
    >
      ⠿
    </span>
  );

  return (
    <div ref={setNodeRef} style={style}>
      <ActivityCard
        activity={activity}
        onMoreClick={onMoreClick}
        dragHandle={dragHandle}
        isDragging={isDragging}
      />
    </div>
  );
}

export function ActivityList({
  activities,
  onMoreClick,
  onReorder,
}: ActivityListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const toIndex = activities.findIndex((a) => a.id === over.id);
    if (toIndex !== -1) {
      onReorder(active.id as string, toIndex);
    }
  }

  if (activities.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-12 text-center px-4"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <span className="text-4xl mb-3">📭</span>
        <p className="text-base font-medium">Žádné aktivity pro tento den.</p>
        <p className="text-sm mt-1">Tap + pro přidání.</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={activities.map((a) => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2 px-4 pb-4">
          {activities.map((activity) => (
            <SortableActivityCard
              key={activity.id}
              activity={activity}
              onMoreClick={onMoreClick}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
