import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function PatientInfoForm({ patientInfo, setPatientInfo }) {
  const handleInputChange = (field, value) => {
    setPatientInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-user-md text-secondary"></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Patient Information</h3>
            <p className="text-sm text-muted-foreground">Optional metadata for enhanced analysis</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="patientId" className="text-sm font-medium text-foreground mb-2">
              Patient ID
            </Label>
            <Input
              id="patientId"
              type="text"
              placeholder="Enter patient ID"
              value={patientInfo.patientId || ''}
              onChange={(e) => handleInputChange('patientId', e.target.value)}
              data-testid="input-patient-id"
            />
          </div>
          
          <div>
            <Label htmlFor="age" className="text-sm font-medium text-foreground mb-2">
              Age
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="Age"
              value={patientInfo.age || ''}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value) || undefined)}
              data-testid="input-age"
            />
          </div>
          
          <div>
            <Label htmlFor="gender" className="text-sm font-medium text-foreground mb-2">
              Gender
            </Label>
            <Select
              value={patientInfo.gender || ''}
              onValueChange={(value) => handleInputChange('gender', value)}
            >
              <SelectTrigger data-testid="select-gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="scanType" className="text-sm font-medium text-foreground mb-2">
              Scan Type
            </Label>
            <Select
              value={patientInfo.scanType || ''}
              onValueChange={(value) => handleInputChange('scanType', value)}
            >
              <SelectTrigger data-testid="select-scan-type">
                <SelectValue placeholder="Select scan type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="t1">T1-weighted</SelectItem>
                <SelectItem value="t2">T2-weighted</SelectItem>
                <SelectItem value="flair">FLAIR</SelectItem>
                <SelectItem value="dwi">Diffusion-weighted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="clinicalNotes" className="text-sm font-medium text-foreground mb-2">
              Clinical Notes
            </Label>
            <Textarea
              id="clinicalNotes"
              placeholder="Any relevant clinical information..."
              rows={3}
              value={patientInfo.clinicalNotes || ''}
              onChange={(e) => handleInputChange('clinicalNotes', e.target.value)}
              data-testid="textarea-clinical-notes"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
