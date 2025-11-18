"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera, Calendar, ArrowLeft, ArrowRight, Plus } from "lucide-react"
import { ProgressPhoto } from "../types"
import { useState } from "react"
import Image from "next/image"

interface ProgressPhotosProps {
  photos: ProgressPhoto[]
}

export function ProgressPhotos({ photos }: ProgressPhotosProps) {
  const [selectedComparison, setSelectedComparison] = useState<'front' | 'side' | 'back'>('front')
  
  // Group photos by type and sort by date
  const photosByType = photos.reduce((acc, photo) => {
    if (!acc[photo.type]) {
      acc[photo.type] = []
    }
    acc[photo.type].push(photo)
    return acc
  }, {} as Record<string, ProgressPhoto[]>)

  // Sort each type by date
  Object.keys(photosByType).forEach(type => {
    photosByType[type].sort((a: ProgressPhoto, b: ProgressPhoto) => new Date(a.date).getTime() - new Date(b.date).getTime())
  })

  const currentPhotos = photosByType[selectedComparison] || []
  const latestPhoto = currentPhotos[currentPhotos.length - 1]
  const firstPhoto = currentPhotos[0]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const calculateDaysBetween = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      {/* Type Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Progress Photo Comparison
          </CardTitle>
          <CardDescription>
            Track your physical transformation over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            {(['front', 'side', 'back'] as const).map((type) => (
              <Button
                key={type}
                variant={selectedComparison === type ? "default" : "outline"}
                onClick={() => setSelectedComparison(type)}
                className="capitalize"
              >
                {type} View
                {photosByType[type] && (
                  <Badge variant="secondary" className="ml-2">
                    {photosByType[type].length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {currentPhotos.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No {selectedComparison} photos yet</h3>
              <p className="text-muted-foreground mb-4">
                Start tracking your progress by adding your first {selectedComparison} view photo
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Photo
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Before/After Comparison */}
              {currentPhotos.length >= 2 && (
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Before</CardTitle>
                        <Badge variant="secondary">
                          {formatDate(firstPhoto.date)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={firstPhoto.url}
                          alt={`Progress photo - ${firstPhoto.type} view - ${firstPhoto.date}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {firstPhoto.notes && (
                        <p className="text-sm text-muted-foreground mt-3">
                          {firstPhoto.notes}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">After</CardTitle>
                        <Badge variant="default">
                          {formatDate(latestPhoto.date)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={latestPhoto.url}
                          alt={`Progress photo - ${latestPhoto.type} view - ${latestPhoto.date}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {latestPhoto.notes && (
                        <p className="text-sm text-muted-foreground mt-3">
                          {latestPhoto.notes}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Progress Stats */}
              {currentPhotos.length >= 2 && (
                <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                  <CardContent className="p-6">
                    <div className="grid gap-4 md:grid-cols-3 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {calculateDaysBetween(firstPhoto.date, latestPhoto.date)}
                        </div>
                        <div className="text-sm text-muted-foreground">Days of Progress</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {currentPhotos.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Photos Taken</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {Math.round(calculateDaysBetween(firstPhoto.date, latestPhoto.date) / currentPhotos.length)}
                        </div>
                        <div className="text-sm text-muted-foreground">Days Between Photos</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Photo Timeline</CardTitle>
                  <CardDescription>
                    All your {selectedComparison} view progress photos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentPhotos.slice().reverse().map((photo: ProgressPhoto, index: number) => (
                      <div key={photo.id} className="flex items-center gap-4 p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors">
                        <div className="relative w-16 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={photo.url}
                            alt={`Progress photo - ${photo.date}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={index === 0 ? "default" : "secondary"}>
                              {index === 0 ? "Latest" : `${index + 1} photos ago`}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {formatDate(photo.date)}
                            </div>
                          </div>
                          {photo.notes && (
                            <p className="text-sm text-muted-foreground">
                              {photo.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            View Full
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Add New Photo CTA */}
              <Card className="border-dashed border-2 border-primary/25 bg-primary/5">
                <CardContent className="p-6 text-center">
                  <Camera className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-medium mb-2">Ready for your next progress photo?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Consistent progress photos help you see changes that the scale might not show
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Photo
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
