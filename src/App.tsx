import { useState, useCallback } from "react";
import { ItineraryProvider } from "./state/context";
import { useItinerary } from "./hooks/useItinerary";
import type { ActiveView, Activity } from "./types";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { ProgramView } from "./components/ProgramView";
import { MapView } from "./components/MapView";
import { ItineraryView } from "./components/ItineraryView";
import { ChecklistView } from "./components/ChecklistView";
import { EditModal } from "./components/EditModal";
import { ActionSheet } from "./components/ActionSheet";
import { SharePanel } from "./components/SharePanel";
import { Toast, type ToastMessage } from "./components/Toast";

function AppInner() {
  const { state, dispatch } = useItinerary();
  const [activeView, setActiveView] = useState<ActiveView>("program");
  const [shareOpen, setShareOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>(undefined);
  const [editingDayId, setEditingDayId] = useState<string>("");

  // Action sheet state
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [actionDayId, setActionDayId] = useState("");
  const [actionActivityId, setActionActivityId] = useState("");

  const addToast = useCallback((message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  function handleAddActivity(dayId: string) {
    setEditingActivity(undefined);
    setEditingDayId(dayId);
    setEditModalOpen(true);
  }

  function handleMoreClick(dayId: string, activityId: string) {
    setActionDayId(dayId);
    setActionActivityId(activityId);
    setActionSheetOpen(true);
  }

  function handleEditActivity() {
    const day = state.days.find((d) => d.id === actionDayId);
    const activity = day?.activities.find((a) => a.id === actionActivityId);
    if (!activity) return;
    setEditingActivity(activity);
    setEditingDayId(actionDayId);
    setEditModalOpen(true);
  }

  function handleDeleteActivity() {
    const day = state.days.find((d) => d.id === actionDayId);
    const activity = day?.activities.find((a) => a.id === actionActivityId);
    if (!activity) return;
    const confirmed = window.confirm(`Opravdu smazat '${activity.title}'?`);
    if (!confirmed) return;
    dispatch({
      type: "REMOVE_ACTIVITY",
      payload: { dayId: actionDayId, activityId: actionActivityId },
    });
  }

  function handleMoveActivity(toDayId: string) {
    dispatch({
      type: "MOVE_ACTIVITY",
      payload: {
        fromDayId: actionDayId,
        toDayId,
        activityId: actionActivityId,
        toIndex: 999,
      },
    });
  }

  function handleSaveActivity(activity: Activity) {
    if (editingActivity) {
      dispatch({
        type: "UPDATE_ACTIVITY",
        payload: { dayId: editingDayId, activity },
      });
    } else {
      dispatch({
        type: "ADD_ACTIVITY",
        payload: { dayId: editingDayId, activity },
      });
    }
  }

  return (
    <>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--color-background)" }}>
        <Header
          title={state.meta.title}
          dateRange={state.meta.dateRange}
          onShareOpen={() => setShareOpen(true)}
        />
        <Navigation activeView={activeView} onViewChange={setActiveView} />

        {activeView === "program" && (
          <ProgramView
            onMoreClick={handleMoreClick}
            onAddActivity={handleAddActivity}
          />
        )}
        {activeView === "map" && <MapView />}
        {activeView === "itinerary" && <ItineraryView />}
        {activeView === "checklist" && <ChecklistView />}
      </div>

      <EditModal
        key={`${editingDayId}-${editingActivity?.id ?? "new"}`}
        activity={editingActivity}
        dayId={editingDayId}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveActivity}
      />

      <ActionSheet
        isOpen={actionSheetOpen}
        onClose={() => setActionSheetOpen(false)}
        onEdit={handleEditActivity}
        onDelete={handleDeleteActivity}
        onMoveTo={handleMoveActivity}
        days={state.days}
        currentDayId={actionDayId}
      />

      <SharePanel
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        onToast={addToast}
      />

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}

export default function App() {
  return (
    <ItineraryProvider>
      <AppInner />
    </ItineraryProvider>
  );
}
