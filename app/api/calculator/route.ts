import { NextRequest, NextResponse } from 'next/server';
import { calculatePipeSupport, CalculatorInput } from '@/lib/calculator';
import { findAllSupportHardware } from '@/lib/vendors/hardware-search';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'material',
      'pipeSize',
      'service',
      'temperature',
      'specificGravity',
      'pipeLength',
      'orientation',
      'mountingMethod',
      'locationType',
    ];
    
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Build input object with defaults
    const input: CalculatorInput = {
      // Pipe Properties
      material: body.material,
      lineClass: body.lineClass,
      pipeSize: body.pipeSize,
      service: body.service,
      temperature: Number(body.temperature),
      specificGravity: Number(body.specificGravity) || 1.0,
      
      // Installation Details
      pipeLength: Number(body.pipeLength),
      orientation: body.orientation,
      mountingMethod: body.mountingMethod,
      locationType: body.locationType,
      
      // Environment
      isIndoor: body.isIndoor ?? true,
      isCorrosive: body.isCorrosive ?? false,
      isInsulated: body.isInsulated ?? false,
      
      // Elbow & Guide Distance (Thermal Expansion)
      hasElbow: body.hasElbow ?? false,
      anchorToElbowDistance: body.anchorToElbowDistance ? Number(body.anchorToElbowDistance) : undefined,
      
      // Continuation from Riser
      isFromRiser: body.isFromRiser ?? false,
      riserLength: body.riserLength ? Number(body.riserLength) : undefined,
      
      // In-line Components
      hasInlineComponent: body.hasInlineComponent ?? false,
      componentWeight: body.componentWeight,
      
      // Special Configurations
      hasFlexibleCoupling: body.hasFlexibleCoupling ?? false,
      isEquipmentConnection: body.isEquipmentConnection ?? false,
      isExpansionLoop: body.isExpansionLoop ?? false,
      expansionLoopLeg: body.expansionLoopLeg,
      isSeismicInterface: body.isSeismicInterface ?? false,
      
      // Branch Piping
      isBranchPipe: body.isBranchPipe ?? false,
      branchOrientation: body.branchOrientation,
      branchDistanceFromAnchor: body.branchDistanceFromAnchor ? Number(body.branchDistanceFromAnchor) : undefined,
      
      // Double-Wall / Special
      isDoubleWall: body.isDoubleWall ?? false,
      carrierPipeMaterial: body.carrierPipeMaterial,
      carrierPipeTemp: body.carrierPipeTemp ? Number(body.carrierPipeTemp) : undefined,
      isPPDWSafetyShower: body.isPPDWSafetyShower ?? false,
      
      // Plastic fittings (40 05 19, Section 1.5.K)
      hasPlasticFitting: body.hasPlasticFitting ?? false,
      plasticFittingType: body.plasticFittingType,
    };
    
    // Calculate support requirements
    const result = calculatePipeSupport(input);
    
    // Determine material type for hardware search
    const materialLower = input.material.toLowerCase();
    const isPlastic = materialLower.includes('pvc') || 
                      materialLower.includes('cpvc') || 
                      materialLower.includes('pp') || 
                      materialLower.includes('pvdf') ||
                      materialLower.includes('polypropylene') ||
                      materialLower.includes('hdpe');
    const materialType: 'plastic' | 'metal' = isPlastic ? 'plastic' : 'metal';
    
    // Search for vendor hardware products
    const hardwareProducts = await findAllSupportHardware({
      materialType,
      pipeSize: input.pipeSize,
      isInsulated: input.isInsulated,
      mountingMethod: input.mountingMethod,
      needsDeadweight: true,
      needsLateral: result.supportTypes.lateral !== null,
      needsAxial: result.supportTypes.axial !== null,
      isVertical: input.orientation === 'vertical',
    });
    
    return NextResponse.json({
      success: true,
      result,
      vendorProducts: hardwareProducts,
    });
  } catch (error) {
    console.error('Calculator error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Calculation failed',
        success: false,
      },
      { status: 500 }
    );
  }
}
