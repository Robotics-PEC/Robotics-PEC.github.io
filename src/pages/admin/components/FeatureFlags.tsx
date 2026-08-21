import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Flag, Plus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createFeatureFlag, getFeatureFlags, updateFeatureFlag } from "@/lib/supabase/actions/flags.actions";
import { FeatureFlagType } from "@/types";


const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80, "Name is too long"),
  isEnabled: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const FeatureFlags = () => {
  const [open, setOpen] = useState(false);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlagType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [key, setKey] = useState(0);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", isEnabled: true },
  });

  useEffect(() => {
    const fetch = async () => {
        const flagsData = await getFeatureFlags();
        setFeatureFlags(flagsData);
    }

    fetch();
  }, [key]);

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-12">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Feature flags</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Turn features on or off across the app.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          New feature
        </Button>
      </div>

      <Card className="mt-6">
        <CardContent className="p-0">
          {featureFlags.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
              <Flag className="size-6 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">No feature flags yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first flag to start rolling out features.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {featureFlags.map((flag) => (
                <li key={flag.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{flag.name}</p>
                    <Badge variant={flag.isEnabled ? "default" : "secondary"} className="mt-1">
                      {flag.isEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <Switch
                    checked={flag.isEnabled}
                    aria-label={`Toggle ${flag.name}`}
                    onCheckedChange={async (checked) => {
                        const error = await updateFeatureFlag(flag.id,checked);

                        if(error) {
                            toast.error(error.message);
                        }

                        setKey(key => key+1);
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={form.handleSubmit(async (values) => {
            setIsSubmitting(true);
            const error = await createFeatureFlag(values);

            if(error) {
                toast.error(error.message);
            }
            setIsSubmitting(false);
            setOpen(false);
            setKey(key => key+1);
            })}>
            <DialogHeader>
              <DialogTitle>Add feature</DialogTitle>
              <DialogDescription>
                Give the feature a name and choose its initial status.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-6">
              <div className="space-y-2">
                <Label htmlFor="feature-name">Name</Label>
                <Input
                  id="feature-name"
                  placeholder="e.g. new-checkout"
                  autoComplete="off"
                  {...form.register("name")}
                />
                {form.formState.errors.name ? (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                ) : null}
              </div>

              <div className="flex items-center justify-between rounded-md border border-border px-4 py-3">
                <div>
                  <Label htmlFor="feature-status">Status</Label>
                  <p className="text-sm text-muted-foreground">
                    {form.watch("isEnabled") ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <Switch
                  id="feature-status"
                  checked={form.watch("isEnabled")}
                  onCheckedChange={(checked) =>
                    form.setValue("isEnabled", checked, { shouldDirty: true })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default FeatureFlags;