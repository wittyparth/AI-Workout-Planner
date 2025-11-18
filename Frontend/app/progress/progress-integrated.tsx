"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, TrendingUp, Weight, Upload, Image as ImageIcon } from "lucide-react"
import { useProgressPhotos, useBodyMetrics, useStrengthProgress } from "@/hooks/useProgress"
import { toast } from "sonner"

export default function ProgressPage() {
  const { photos, uploadPhoto, deletePhoto, isLoading: photosLoading } = useProgressPhotos()
  const { metrics, logMetric, isLoading: metricsLoading } = useBodyMetrics()
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [photoNotes, setPhotoNotes] = useState("")
  const [metricType, setMetricType] = useState("weight")
  const [metricValue, setMetricValue] = useState("")
  const [metricUnit, setMetricUnit] = useState("kg")

  const handlePhotoUpload = async () => {
    if (!uploadFile) {
      toast.error("Please select a photo")
      return
    }

    try {
      await uploadPhoto(uploadFile, photoNotes)
      setUploadFile(null)
      setPhotoNotes("")
    } catch (error) {
      console.error("Upload error:", error)
    }
  }

  const handleLogMetric = async () => {
    if (!metricValue) {
      toast.error("Please enter a value")
      return
    }

    try {
      await logMetric({
        metricType,
        value: parseFloat(metricValue),
        unit: metricUnit,
      })
      setMetricValue("")
    } catch (error) {
      console.error("Log metric error:", error)
    }
  }

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          Progress Tracking
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your transformation with photos, body metrics, and strength gains
        </p>
      </div>

      <Tabs defaultValue="photos" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="photos">Progress Photos</TabsTrigger>
          <TabsTrigger value="metrics">Body Metrics</TabsTrigger>
          <TabsTrigger value="strength">Strength Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Upload Progress Photo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Photo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Input
                  placeholder="E.g., Front view, 12 weeks in..."
                  value={photoNotes}
                  onChange={(e) => setPhotoNotes(e.target.value)}
                />
              </div>
              <Button onClick={handlePhotoUpload} disabled={!uploadFile}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Photo
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Progress Photos</CardTitle>
              <CardDescription>
                {photos.length} photos uploaded
              </CardDescription>
            </CardHeader>
            <CardContent>
              {photosLoading ? (
                <p className="text-center text-muted-foreground py-8">Loading photos...</p>
              ) : photos.length === 0 ? (
                <div className="text-center py-8">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No progress photos yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload your first photo to start tracking your transformation
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.map((photo) => (
                    <div key={photo._id} className="relative group">
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                        <img
                          src={photo.url}
                          alt={photo.notes || "Progress photo"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium">
                          {new Date(photo.date).toLocaleDateString()}
                        </p>
                        {photo.notes && (
                          <p className="text-xs text-muted-foreground">{photo.notes}</p>
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deletePhoto(photo._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Weight className="h-5 w-5" />
                Log Body Metric
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Metric Type</Label>
                  <select
                    className="w-full p-2 border rounded"
                    value={metricType}
                    onChange={(e) => setMetricType(e.target.value)}
                  >
                    <option value="weight">Weight</option>
                    <option value="bodyfat">Body Fat %</option>
                    <option value="chest">Chest</option>
                    <option value="waist">Waist</option>
                    <option value="hips">Hips</option>
                    <option value="arms">Arms</option>
                    <option value="legs">Legs</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Value</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={metricValue}
                    onChange={(e) => setMetricValue(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <select
                    className="w-full p-2 border rounded"
                    value={metricUnit}
                    onChange={(e) => setMetricUnit(e.target.value)}
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                    <option value="cm">cm</option>
                    <option value="inches">inches</option>
                    <option value="%">%</option>
                  </select>
                </div>
              </div>
              <Button onClick={handleLogMetric}>
                Log Metric
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metric History</CardTitle>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <p className="text-center text-muted-foreground py-8">Loading metrics...</p>
              ) : metrics.length === 0 ? (
                <div className="text-center py-8">
                  <Weight className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No metrics logged yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {metrics.slice(0, 10).map((metric) => (
                    <div key={metric._id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium capitalize">{metric.metricType}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(metric.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {metric.value} {metric.unit}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strength" className="space-y-4">
          <Card>
            <CardContent className="text-center py-12">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Strength Progress Charts</h3>
              <p className="text-sm text-muted-foreground">
                Track your strength gains over time for each exercise
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Complete workouts to see your progress charts here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
