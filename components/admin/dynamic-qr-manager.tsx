'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import jsPDF from 'jspdf'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { QRCodeSVG } from 'qrcode.react'
import { Loader2, Plus, Download, Pencil, Trash2, Link as LinkIcon, BarChart2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Simple random ID generator
const generateShortId = () => Math.random().toString(36).substring(2, 8);

export function DynamicQrManager() {
  const [qrs, setQrs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Forms
  const [newQrOpen, setNewQrOpen] = useState(false)
  const [editQrOpen, setEditQrOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [newQr, setNewQr] = useState({ title: '', destination_url: '' })
  const [editingQr, setEditingQr] = useState<any>(null)
  
  // Download Modal
  const [downloadOpen, setDownloadOpen] = useState(false)
  const [selectedQr, setSelectedQr] = useState<any>(null)
  const qrRef = useRef<SVGSVGElement>(null)

  const fetchQrs = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('dynamic_qrs')
      .select('*')
      .order('created_at', { ascending: false })
      
    if (error) {
      console.error('Error fetching QRs:', error)
    } else {
      setQrs(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchQrs()
  }, [])

  const handleCreateQr = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    let dest = newQr.destination_url.trim();
    if (!dest.startsWith('http') && !dest.startsWith('/')) {
        dest = `https://${dest}`;
    }

    const newId = generateShortId();

    try {
      const { error } = await supabase
        .from('dynamic_qrs')
        .insert([{ 
            id: newId, 
            title: newQr.title, 
            destination_url: dest 
        }])

      if (error) throw error
      
      alert('Dynamic QR code created successfully!')
      setNewQrOpen(false)
      setNewQr({ title: '', destination_url: '' })
      fetchQrs()
    } catch (error: any) {
      console.error('Error creating QR:', error)
      alert(`Failed to create QR: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateQr = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingQr) return
    setIsSubmitting(true)
    
    let dest = editingQr.destination_url.trim();
    if (!dest.startsWith('http') && !dest.startsWith('/')) {
        dest = `https://${dest}`;
    }

    try {
      const { error } = await supabase
        .from('dynamic_qrs')
        .update({ 
            title: editingQr.title, 
            destination_url: dest 
        })
        .eq('id', editingQr.id)

      if (error) throw error
      
      alert('QR code destination updated!')
      setEditQrOpen(false)
      setEditingQr(null)
      fetchQrs()
    } catch (error: any) {
      console.error('Error updating QR:', error)
      alert(`Failed to update QR: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteQr = async (id: string) => {
    if (!confirm('Are you sure you want to delete this QR code? Scanning it will result in a broken link.')) return
    try {
      await supabase.from('dynamic_qrs').delete().eq('id', id)
      fetchQrs()
    } catch (error) {
      console.error('Error deleting QR:', error)
    }
  }

  const getFullQrUrl = (id: string) => {
    // Determine the base URL dynamically based on environment
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.sacgnh.org'
    return `${baseUrl}/qr/${id}`
  }

  const handleDownloadClick = (qr: any) => {
    setSelectedQr(qr)
    setDownloadOpen(true)
  }

  const downloadSVG = () => {
    if (!qrRef.current || !selectedQr) return;

    const clone = qrRef.current.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const origSize = qrRef.current.getAttribute('width') || '200';
    clone.setAttribute('viewBox', `0 0 ${origSize} ${origSize}`);
    clone.setAttribute('width', '800');
    clone.setAttribute('height', '800');

    const svgData = new XMLSerializer().serializeToString(clone);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SACG_QR_${selectedQr.title.replace(/\s+/g, '_')}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    if (!qrRef.current || !selectedQr) return;

    const svgData = new XMLSerializer().serializeToString(qrRef.current);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const px = 800;
      canvas.width = px;
      canvas.height = px;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, px, px);
      ctx.drawImage(img, 0, 0, px, px);

      const imgData = canvas.toDataURL('image/png');

      // A4: 210 × 297 mm — QR only, perfectly centered
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = 210;
      const pageH = 297;
      const qrMM = 150;
      const x = (pageW - qrMM) / 2;
      const y = (pageH - qrMM) / 2;

      pdf.addImage(imgData, 'PNG', x, y, qrMM, qrMM);
      pdf.save(`SACG_QR_${selectedQr.title.replace(/\s+/g, '_')}.pdf`);
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  }

  if (loading) {
    return <div className="p-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Dynamic QR Codes</CardTitle>
          <CardDescription>Create permanent QR codes whose destination URLs can be changed anytime.</CardDescription>
        </div>
        <Dialog open={newQrOpen} onOpenChange={setNewQrOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> New Dynamic QR</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Dynamic QR Code</DialogTitle>
              <DialogDescription>The generated QR code will be permanent, but you can change where it points later.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateQr} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="qr-title">Title (For admin reference) *</Label>
                <Input id="qr-title" required placeholder="e.g. Spring Event Flyer" value={newQr.title} onChange={e => setNewQr({ ...newQr, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qr-dest">Destination URL *</Label>
                <Input id="qr-dest" required placeholder="e.g. /events/spring-event or https://google.com" value={newQr.destination_url} onChange={e => setNewQr({ ...newQr, destination_url: e.target.value })} />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create QR Code'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {qrs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No dynamic QR codes generated yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Scans</TableHead>
                <TableHead>Redirect ID</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {qrs.map((qr) => (
                <TableRow key={qr.id}>
                  <TableCell className="font-medium">{qr.title}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    <a href={qr.destination_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline inline-flex items-center">
                        <LinkIcon className="h-3 w-3 mr-1" />
                        {qr.destination_url}
                    </a>
                  </TableCell>
                  <TableCell>
                      <div className="flex items-center font-semibold">
                        <BarChart2 className="h-4 w-4 mr-2 text-muted-foreground" />
                        {qr.scan_count}
                      </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">/qr/{qr.id}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleDownloadClick(qr)}>
                          <Download className="h-4 w-4 mr-2" /> QR
                      </Button>
                      <Button size="icon" variant="ghost" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50" onClick={() => { setEditingQr(qr); setEditQrOpen(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteQr(qr.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={editQrOpen} onOpenChange={setEditQrOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Destination</DialogTitle>
            <DialogDescription>Update where this QR code redirects users.</DialogDescription>
          </DialogHeader>
          {editingQr && (
            <form onSubmit={handleUpdateQr} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-qr-title">Title</Label>
                <Input id="edit-qr-title" required value={editingQr.title} onChange={e => setEditingQr({ ...editingQr, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-qr-dest">New Destination URL *</Label>
                <Input id="edit-qr-dest" required value={editingQr.destination_url} onChange={e => setEditingQr({ ...editingQr, destination_url: e.target.value })} />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Update Destination'}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Download Dialog */}
      <Dialog open={downloadOpen} onOpenChange={setDownloadOpen}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <DialogTitle className="text-center">{selectedQr?.title}</DialogTitle>
            <DialogDescription className="text-center">Permanent Link: /qr/{selectedQr?.id}</DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center p-6 bg-white rounded-lg my-4 mx-auto border shadow-sm">
             {selectedQr && (
                <QRCodeSVG
                    value={getFullQrUrl(selectedQr.id)}
                    size={200}
                    level="H"
                    includeMargin={true}
                    ref={qrRef}
                />
             )}
          </div>
          
          <div className="flex gap-2 w-full">
            <Button onClick={downloadSVG} variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" /> SVG
            </Button>
            <Button onClick={downloadPDF} className="flex-1">
              <Download className="h-4 w-4 mr-2" /> PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </Card>
  )
}
