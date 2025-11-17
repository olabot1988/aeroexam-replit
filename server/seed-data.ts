import { db } from "./db";
import { questions } from "@shared/schema";
import { type InsertQuestion } from "@shared/schema";

const sampleQuestions: InsertQuestion[] = [
  {
    text: "ML0 General Maintenance Q1: What is the primary purpose of general maintenance?",
    options: ["Safety","Cost reduction","Performance","Aesthetics"],
    correctAnswer: 0,
    difficulties: ["ML0"],
    category: "General Maintenance"
  },
  {
    text: "ML0 Tools and Equipment Q2: Which tool is used for precision measurement?",
    options: ["Hammer","Specialized tool","Wrench","Pliers"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Tools and Equipment"
  },
  {
    text: "ML0 Safety Q3: What safety equipment is required when working in hazardous areas?",
    options: ["None","Appropriate PPE","Only goggles","Only gloves"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Safety"
  },
  {
    text: "ML0 Documentation Q4: When should you perform maintenance?",
    options: ["Never","According to manual procedures","Anytime","Only during emergencies"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Documentation"
  },
  {
    text: "ML0 Procedures Q5: What is the primary purpose of procedures?",
    options: ["Safety","Cost reduction","Performance","Aesthetics"],
    correctAnswer: 0,
    difficulties: ["ML0"],
    category: "Procedures"
  },
  {
    text: "ML0 Fuel Systems Q6: Which tool is used for precision measurement?",
    options: ["Hammer","Specialized tool","Wrench","Pliers"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Fuel Systems"
  },
  {
    text: "ML0 Electrical Systems Q7: What safety equipment is required when working in hazardous areas?",
    options: ["None","Appropriate PPE","Only goggles","Only gloves"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Electrical Systems"
  },
  {
    text: "ML0 Hydraulic Systems Q8: When should you perform maintenance?",
    options: ["Never","According to manual procedures","Anytime","Only during emergencies"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Hydraulic Systems"
  },
  {
    text: "ML0 Powerplant Q9: What is the primary purpose of powerplant?",
    options: ["Safety","Cost reduction","Performance","Aesthetics"],
    correctAnswer: 0,
    difficulties: ["ML0"],
    category: "Powerplant"
  },
  {
    text: "ML0 Structural Q10: Which tool is used for precision measurement?",
    options: ["Hammer","Specialized tool","Wrench","Pliers"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Structural"
  },
  {
    text: "ML0 Materials Q11: What safety equipment is required when working in hazardous areas?",
    options: ["None","Appropriate PPE","Only goggles","Only gloves"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Materials"
  },
  {
    text: "ML0 Inspection Q12: When should you perform maintenance?",
    options: ["Never","According to manual procedures","Anytime","Only during emergencies"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Inspection"
  },
  {
    text: "ML0 Aircraft Systems Q13: What is the primary purpose of aircraft systems?",
    options: ["Safety","Cost reduction","Performance","Aesthetics"],
    correctAnswer: 0,
    difficulties: ["ML0"],
    category: "Aircraft Systems"
  },
  {
    text: "ML0 Landing Gear Q14: Which tool is used for precision measurement?",
    options: ["Hammer","Specialized tool","Wrench","Pliers"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Landing Gear"
  },
  {
    text: "ML0 Instruments Q15: What safety equipment is required when working in hazardous areas?",
    options: ["None","Appropriate PPE","Only goggles","Only gloves"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Instruments"
  },
  {
    text: "ML0 Mechanical Systems Q16: When should you perform maintenance?",
    options: ["Never","According to manual procedures","Anytime","Only during emergencies"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Mechanical Systems"
  },
  {
    text: "ML0 Hardware Q17: What is the primary purpose of hardware?",
    options: ["Safety","Cost reduction","Performance","Aesthetics"],
    correctAnswer: 0,
    difficulties: ["ML0"],
    category: "Hardware"
  },
  {
    text: "ML0 General Maintenance Q18: Which tool is used for precision measurement?",
    options: ["Hammer","Specialized tool","Wrench","Pliers"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "General Maintenance"
  },
  {
    text: "ML0 Tools and Equipment Q19: What safety equipment is required when working in hazardous areas?",
    options: ["None","Appropriate PPE","Only goggles","Only gloves"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Tools and Equipment"
  },
  {
    text: "ML0 Safety Q20: When should you perform maintenance?",
    options: ["Never","According to manual procedures","Anytime","Only during emergencies"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Safety"
  },
  {
    text: "ML0 Documentation Q21: What is the primary purpose of documentation?",
    options: ["Safety","Cost reduction","Performance","Aesthetics"],
    correctAnswer: 0,
    difficulties: ["ML0"],
    category: "Documentation"
  },
  {
    text: "ML0 Procedures Q22: Which tool is used for precision measurement?",
    options: ["Hammer","Specialized tool","Wrench","Pliers"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Procedures"
  },
  {
    text: "ML0 Fuel Systems Q23: What safety equipment is required when working in hazardous areas?",
    options: ["None","Appropriate PPE","Only goggles","Only gloves"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Fuel Systems"
  },
  {
    text: "ML0 Electrical Systems Q24: When should you perform maintenance?",
    options: ["Never","According to manual procedures","Anytime","Only during emergencies"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Electrical Systems"
  },
  {
    text: "ML0 Hydraulic Systems Q25: What is the primary purpose of hydraulic systems?",
    options: ["Safety","Cost reduction","Performance","Aesthetics"],
    correctAnswer: 0,
    difficulties: ["ML0"],
    category: "Hydraulic Systems"
  },
  {
    text: "ML0 Powerplant Q26: Which tool is used for precision measurement?",
    options: ["Hammer","Specialized tool","Wrench","Pliers"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Powerplant"
  },
  {
    text: "ML0 Structural Q27: What safety equipment is required when working in hazardous areas?",
    options: ["None","Appropriate PPE","Only goggles","Only gloves"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Structural"
  },
  {
    text: "ML0 Materials Q28: When should you perform maintenance?",
    options: ["Never","According to manual procedures","Anytime","Only during emergencies"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Materials"
  },
  {
    text: "ML0 Inspection Q29: What is the primary purpose of inspection?",
    options: ["Safety","Cost reduction","Performance","Aesthetics"],
    correctAnswer: 0,
    difficulties: ["ML0"],
    category: "Inspection"
  },
  {
    text: "ML0 Aircraft Systems Q30: Which tool is used for precision measurement?",
    options: ["Hammer","Specialized tool","Wrench","Pliers"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Aircraft Systems"
  },
  {
    text: "ML0 Landing Gear Q31: What safety equipment is required when working in hazardous areas?",
    options: ["None","Appropriate PPE","Only goggles","Only gloves"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Landing Gear"
  },
  {
    text: "ML0 Instruments Q32: When should you perform maintenance?",
    options: ["Never","According to manual procedures","Anytime","Only during emergencies"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Instruments"
  },
  {
    text: "ML0 Mechanical Systems Q33: What is the primary purpose of mechanical systems?",
    options: ["Safety","Cost reduction","Performance","Aesthetics"],
    correctAnswer: 0,
    difficulties: ["ML0"],
    category: "Mechanical Systems"
  },
  {
    text: "ML0 Hardware Q34: Which tool is used for precision measurement?",
    options: ["Hammer","Specialized tool","Wrench","Pliers"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Hardware"
  },
  {
    text: "ML0 General Maintenance Q35: What safety equipment is required when working in hazardous areas?",
    options: ["None","Appropriate PPE","Only goggles","Only gloves"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "General Maintenance"
  },
  {
    text: "ML0 Tools and Equipment Q36: When should you perform maintenance?",
    options: ["Never","According to manual procedures","Anytime","Only during emergencies"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Tools and Equipment"
  },
  {
    text: "ML0 Safety Q37: What is the primary purpose of safety?",
    options: ["Safety","Cost reduction","Performance","Aesthetics"],
    correctAnswer: 0,
    difficulties: ["ML0"],
    category: "Safety"
  },
  {
    text: "ML0 Documentation Q38: Which tool is used for precision measurement?",
    options: ["Hammer","Specialized tool","Wrench","Pliers"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Documentation"
  },
  {
    text: "ML0 Procedures Q39: What safety equipment is required when working in hazardous areas?",
    options: ["None","Appropriate PPE","Only goggles","Only gloves"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Procedures"
  },
  {
    text: "ML0 Fuel Systems Q40: When should you perform maintenance?",
    options: ["Never","According to manual procedures","Anytime","Only during emergencies"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Fuel Systems"
  },
  {
    text: "ML0 Electrical Systems Q41: What is the primary purpose of electrical systems?",
    options: ["Safety","Cost reduction","Performance","Aesthetics"],
    correctAnswer: 0,
    difficulties: ["ML0"],
    category: "Electrical Systems"
  },
  {
    text: "ML0 Hydraulic Systems Q42: Which tool is used for precision measurement?",
    options: ["Hammer","Specialized tool","Wrench","Pliers"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Hydraulic Systems"
  },
  {
    text: "ML0 Powerplant Q43: What safety equipment is required when working in hazardous areas?",
    options: ["None","Appropriate PPE","Only goggles","Only gloves"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Powerplant"
  },
  {
    text: "ML0 Structural Q44: When should you perform maintenance?",
    options: ["Never","According to manual procedures","Anytime","Only during emergencies"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Structural"
  },
  {
    text: "ML0 Materials Q45: What is the primary purpose of materials?",
    options: ["Safety","Cost reduction","Performance","Aesthetics"],
    correctAnswer: 0,
    difficulties: ["ML0"],
    category: "Materials"
  },
  {
    text: "ML0 Inspection Q46: Which tool is used for precision measurement?",
    options: ["Hammer","Specialized tool","Wrench","Pliers"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Inspection"
  },
  {
    text: "ML0 Aircraft Systems Q47: What safety equipment is required when working in hazardous areas?",
    options: ["None","Appropriate PPE","Only goggles","Only gloves"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Aircraft Systems"
  },
  {
    text: "ML0 Landing Gear Q48: When should you perform maintenance?",
    options: ["Never","According to manual procedures","Anytime","Only during emergencies"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Landing Gear"
  },
  {
    text: "ML0 Instruments Q49: What is the primary purpose of instruments?",
    options: ["Safety","Cost reduction","Performance","Aesthetics"],
    correctAnswer: 0,
    difficulties: ["ML0"],
    category: "Instruments"
  },
  {
    text: "ML0 Mechanical Systems Q50: Which tool is used for precision measurement?",
    options: ["Hammer","Specialized tool","Wrench","Pliers"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Mechanical Systems"
  },
  {
    text: "ML0 Hardware Q51: What safety equipment is required when working in hazardous areas?",
    options: ["None","Appropriate PPE","Only goggles","Only gloves"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Hardware"
  },
  {
    text: "ML0 General Maintenance Q52: When should you perform maintenance?",
    options: ["Never","According to manual procedures","Anytime","Only during emergencies"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "General Maintenance"
  },
  {
    text: "ML0 Tools and Equipment Q53: What is the primary purpose of tools and equipment?",
    options: ["Safety","Cost reduction","Performance","Aesthetics"],
    correctAnswer: 0,
    difficulties: ["ML0"],
    category: "Tools and Equipment"
  },
  {
    text: "ML0 Safety Q54: Which tool is used for precision measurement?",
    options: ["Hammer","Specialized tool","Wrench","Pliers"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Safety"
  },
  {
    text: "ML0 Documentation Q55: What safety equipment is required when working in hazardous areas?",
    options: ["None","Appropriate PPE","Only goggles","Only gloves"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Documentation"
  },
  {
    text: "ML0 Procedures Q56: When should you perform maintenance?",
    options: ["Never","According to manual procedures","Anytime","Only during emergencies"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Procedures"
  },
  {
    text: "ML0 Fuel Systems Q57: What is the primary purpose of fuel systems?",
    options: ["Safety","Cost reduction","Performance","Aesthetics"],
    correctAnswer: 0,
    difficulties: ["ML0"],
    category: "Fuel Systems"
  },
  {
    text: "ML0 Electrical Systems Q58: Which tool is used for precision measurement?",
    options: ["Hammer","Specialized tool","Wrench","Pliers"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Electrical Systems"
  },
  {
    text: "ML0 Hydraulic Systems Q59: What safety equipment is required when working in hazardous areas?",
    options: ["None","Appropriate PPE","Only goggles","Only gloves"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Hydraulic Systems"
  },
  {
    text: "ML0 Powerplant Q60: When should you perform maintenance?",
    options: ["Never","According to manual procedures","Anytime","Only during emergencies"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Powerplant"
  },
  {
    text: "ML1 General Maintenance Q1: What is the operating range for general maintenance?",
    options: ["100-500","1000-3000","5000-7000","8000-10000"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "General Maintenance"
  },
  {
    text: "ML1 Tools and Equipment Q2: Which component converts AC to DC?",
    options: ["Transformer","Converter/Regulator","Filter","Amplifier"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Tools and Equipment"
  },
  {
    text: "ML1 Safety Q3: What inspection method detects surface cracks?",
    options: ["Visual only","Specialized NDT method","Measurement","Functional test"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Safety"
  },
  {
    text: "ML1 Documentation Q4: What is the purpose of documentation component?",
    options: ["Decoration","Critical system function","Optional enhancement","Weight balance"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Documentation"
  },
  {
    text: "ML1 Procedures Q5: What is the operating range for procedures?",
    options: ["100-500","1000-3000","5000-7000","8000-10000"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Procedures"
  },
  {
    text: "ML1 Fuel Systems Q6: Which component converts AC to DC?",
    options: ["Transformer","Converter/Regulator","Filter","Amplifier"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Fuel Systems"
  },
  {
    text: "ML1 Electrical Systems Q7: What inspection method detects surface cracks?",
    options: ["Visual only","Specialized NDT method","Measurement","Functional test"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Electrical Systems"
  },
  {
    text: "ML1 Hydraulic Systems Q8: What is the purpose of hydraulic systems component?",
    options: ["Decoration","Critical system function","Optional enhancement","Weight balance"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Hydraulic Systems"
  },
  {
    text: "ML1 Powerplant Q9: What is the operating range for powerplant?",
    options: ["100-500","1000-3000","5000-7000","8000-10000"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Powerplant"
  },
  {
    text: "ML1 Structural Q10: Which component converts AC to DC?",
    options: ["Transformer","Converter/Regulator","Filter","Amplifier"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Structural"
  },
  {
    text: "ML1 Materials Q11: What inspection method detects surface cracks?",
    options: ["Visual only","Specialized NDT method","Measurement","Functional test"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Materials"
  },
  {
    text: "ML1 Inspection Q12: What is the purpose of inspection component?",
    options: ["Decoration","Critical system function","Optional enhancement","Weight balance"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Inspection"
  },
  {
    text: "ML1 Aircraft Systems Q13: What is the operating range for aircraft systems?",
    options: ["100-500","1000-3000","5000-7000","8000-10000"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Aircraft Systems"
  },
  {
    text: "ML1 Landing Gear Q14: Which component converts AC to DC?",
    options: ["Transformer","Converter/Regulator","Filter","Amplifier"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Landing Gear"
  },
  {
    text: "ML1 Instruments Q15: What inspection method detects surface cracks?",
    options: ["Visual only","Specialized NDT method","Measurement","Functional test"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Instruments"
  },
  {
    text: "ML1 Mechanical Systems Q16: What is the purpose of mechanical systems component?",
    options: ["Decoration","Critical system function","Optional enhancement","Weight balance"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Mechanical Systems"
  },
  {
    text: "ML1 Hardware Q17: What is the operating range for hardware?",
    options: ["100-500","1000-3000","5000-7000","8000-10000"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Hardware"
  },
  {
    text: "ML1 General Maintenance Q18: Which component converts AC to DC?",
    options: ["Transformer","Converter/Regulator","Filter","Amplifier"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "General Maintenance"
  },
  {
    text: "ML1 Tools and Equipment Q19: What inspection method detects surface cracks?",
    options: ["Visual only","Specialized NDT method","Measurement","Functional test"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Tools and Equipment"
  },
  {
    text: "ML1 Safety Q20: What is the purpose of safety component?",
    options: ["Decoration","Critical system function","Optional enhancement","Weight balance"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Safety"
  },
  {
    text: "ML1 Documentation Q21: What is the operating range for documentation?",
    options: ["100-500","1000-3000","5000-7000","8000-10000"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Documentation"
  },
  {
    text: "ML1 Procedures Q22: Which component converts AC to DC?",
    options: ["Transformer","Converter/Regulator","Filter","Amplifier"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Procedures"
  },
  {
    text: "ML1 Fuel Systems Q23: What inspection method detects surface cracks?",
    options: ["Visual only","Specialized NDT method","Measurement","Functional test"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Fuel Systems"
  },
  {
    text: "ML1 Electrical Systems Q24: What is the purpose of electrical systems component?",
    options: ["Decoration","Critical system function","Optional enhancement","Weight balance"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Electrical Systems"
  },
  {
    text: "ML1 Hydraulic Systems Q25: What is the operating range for hydraulic systems?",
    options: ["100-500","1000-3000","5000-7000","8000-10000"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Hydraulic Systems"
  },
  {
    text: "ML1 Powerplant Q26: Which component converts AC to DC?",
    options: ["Transformer","Converter/Regulator","Filter","Amplifier"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Powerplant"
  },
  {
    text: "ML1 Structural Q27: What inspection method detects surface cracks?",
    options: ["Visual only","Specialized NDT method","Measurement","Functional test"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Structural"
  },
  {
    text: "ML1 Materials Q28: What is the purpose of materials component?",
    options: ["Decoration","Critical system function","Optional enhancement","Weight balance"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Materials"
  },
  {
    text: "ML1 Inspection Q29: What is the operating range for inspection?",
    options: ["100-500","1000-3000","5000-7000","8000-10000"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Inspection"
  },
  {
    text: "ML1 Aircraft Systems Q30: Which component converts AC to DC?",
    options: ["Transformer","Converter/Regulator","Filter","Amplifier"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Aircraft Systems"
  },
  {
    text: "ML1 Landing Gear Q31: What inspection method detects surface cracks?",
    options: ["Visual only","Specialized NDT method","Measurement","Functional test"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Landing Gear"
  },
  {
    text: "ML1 Instruments Q32: What is the purpose of instruments component?",
    options: ["Decoration","Critical system function","Optional enhancement","Weight balance"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Instruments"
  },
  {
    text: "ML1 Mechanical Systems Q33: What is the operating range for mechanical systems?",
    options: ["100-500","1000-3000","5000-7000","8000-10000"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Mechanical Systems"
  },
  {
    text: "ML1 Hardware Q34: Which component converts AC to DC?",
    options: ["Transformer","Converter/Regulator","Filter","Amplifier"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Hardware"
  },
  {
    text: "ML1 General Maintenance Q35: What inspection method detects surface cracks?",
    options: ["Visual only","Specialized NDT method","Measurement","Functional test"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "General Maintenance"
  },
  {
    text: "ML1 Tools and Equipment Q36: What is the purpose of tools and equipment component?",
    options: ["Decoration","Critical system function","Optional enhancement","Weight balance"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Tools and Equipment"
  },
  {
    text: "ML1 Safety Q37: What is the operating range for safety?",
    options: ["100-500","1000-3000","5000-7000","8000-10000"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Safety"
  },
  {
    text: "ML1 Documentation Q38: Which component converts AC to DC?",
    options: ["Transformer","Converter/Regulator","Filter","Amplifier"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Documentation"
  },
  {
    text: "ML1 Procedures Q39: What inspection method detects surface cracks?",
    options: ["Visual only","Specialized NDT method","Measurement","Functional test"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Procedures"
  },
  {
    text: "ML1 Fuel Systems Q40: What is the purpose of fuel systems component?",
    options: ["Decoration","Critical system function","Optional enhancement","Weight balance"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Fuel Systems"
  },
  {
    text: "ML1 Electrical Systems Q41: What is the operating range for electrical systems?",
    options: ["100-500","1000-3000","5000-7000","8000-10000"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Electrical Systems"
  },
  {
    text: "ML1 Hydraulic Systems Q42: Which component converts AC to DC?",
    options: ["Transformer","Converter/Regulator","Filter","Amplifier"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Hydraulic Systems"
  },
  {
    text: "ML1 Powerplant Q43: What inspection method detects surface cracks?",
    options: ["Visual only","Specialized NDT method","Measurement","Functional test"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Powerplant"
  },
  {
    text: "ML1 Structural Q44: What is the purpose of structural component?",
    options: ["Decoration","Critical system function","Optional enhancement","Weight balance"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Structural"
  },
  {
    text: "ML1 Materials Q45: What is the operating range for materials?",
    options: ["100-500","1000-3000","5000-7000","8000-10000"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Materials"
  },
  {
    text: "ML1 Inspection Q46: Which component converts AC to DC?",
    options: ["Transformer","Converter/Regulator","Filter","Amplifier"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Inspection"
  },
  {
    text: "ML1 Aircraft Systems Q47: What inspection method detects surface cracks?",
    options: ["Visual only","Specialized NDT method","Measurement","Functional test"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Aircraft Systems"
  },
  {
    text: "ML1 Landing Gear Q48: What is the purpose of landing gear component?",
    options: ["Decoration","Critical system function","Optional enhancement","Weight balance"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Landing Gear"
  },
  {
    text: "ML1 Instruments Q49: What is the operating range for instruments?",
    options: ["100-500","1000-3000","5000-7000","8000-10000"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Instruments"
  },
  {
    text: "ML1 Mechanical Systems Q50: Which component converts AC to DC?",
    options: ["Transformer","Converter/Regulator","Filter","Amplifier"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Mechanical Systems"
  },
  {
    text: "ML1 Hardware Q51: What inspection method detects surface cracks?",
    options: ["Visual only","Specialized NDT method","Measurement","Functional test"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Hardware"
  },
  {
    text: "ML1 General Maintenance Q52: What is the purpose of general maintenance component?",
    options: ["Decoration","Critical system function","Optional enhancement","Weight balance"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "General Maintenance"
  },
  {
    text: "ML1 Tools and Equipment Q53: What is the operating range for tools and equipment?",
    options: ["100-500","1000-3000","5000-7000","8000-10000"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Tools and Equipment"
  },
  {
    text: "ML1 Safety Q54: Which component converts AC to DC?",
    options: ["Transformer","Converter/Regulator","Filter","Amplifier"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Safety"
  },
  {
    text: "ML1 Documentation Q55: What inspection method detects surface cracks?",
    options: ["Visual only","Specialized NDT method","Measurement","Functional test"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Documentation"
  },
  {
    text: "ML1 Procedures Q56: What is the purpose of procedures component?",
    options: ["Decoration","Critical system function","Optional enhancement","Weight balance"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Procedures"
  },
  {
    text: "ML1 Fuel Systems Q57: What is the operating range for fuel systems?",
    options: ["100-500","1000-3000","5000-7000","8000-10000"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Fuel Systems"
  },
  {
    text: "ML1 Electrical Systems Q58: Which component converts AC to DC?",
    options: ["Transformer","Converter/Regulator","Filter","Amplifier"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Electrical Systems"
  },
  {
    text: "ML1 Hydraulic Systems Q59: What inspection method detects surface cracks?",
    options: ["Visual only","Specialized NDT method","Measurement","Functional test"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Hydraulic Systems"
  },
  {
    text: "ML1 Powerplant Q60: What is the purpose of powerplant component?",
    options: ["Decoration","Critical system function","Optional enhancement","Weight balance"],
    correctAnswer: 1,
    difficulties: ["ML1"],
    category: "Powerplant"
  },
  {
    text: "ML2 General Maintenance Q1: In advanced general maintenance, what provides automated control?",
    options: ["Manual control","Automated control system","Mechanical linkage","Hydraulic pressure"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "General Maintenance"
  },
  {
    text: "ML2 Tools and Equipment Q2: What parameter indicates system malfunction in tools and equipment?",
    options: ["Normal readings","Abnormal specific reading","No indication","Visual inspection only"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Tools and Equipment"
  },
  {
    text: "ML2 Safety Q3: Which material property is critical for high-stress applications?",
    options: ["Color","Specific technical property","Weight only","Cost"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Safety"
  },
  {
    text: "ML2 Documentation Q4: What is the bypass ratio in turbofan engines?",
    options: ["1:1","Specific technical ratio","No bypass","Variable"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Documentation"
  },
  {
    text: "ML2 Procedures Q5: In advanced procedures, what provides automated control?",
    options: ["Manual control","Automated control system","Mechanical linkage","Hydraulic pressure"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Procedures"
  },
  {
    text: "ML2 Fuel Systems Q6: What parameter indicates system malfunction in fuel systems?",
    options: ["Normal readings","Abnormal specific reading","No indication","Visual inspection only"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Fuel Systems"
  },
  {
    text: "ML2 Electrical Systems Q7: Which material property is critical for high-stress applications?",
    options: ["Color","Specific technical property","Weight only","Cost"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Electrical Systems"
  },
  {
    text: "ML2 Hydraulic Systems Q8: What is the bypass ratio in turbofan engines?",
    options: ["1:1","Specific technical ratio","No bypass","Variable"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Hydraulic Systems"
  },
  {
    text: "ML2 Powerplant Q9: In advanced powerplant, what provides automated control?",
    options: ["Manual control","Automated control system","Mechanical linkage","Hydraulic pressure"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Powerplant"
  },
  {
    text: "ML2 Structural Q10: What parameter indicates system malfunction in structural?",
    options: ["Normal readings","Abnormal specific reading","No indication","Visual inspection only"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Structural"
  },
  {
    text: "ML2 Materials Q11: Which material property is critical for high-stress applications?",
    options: ["Color","Specific technical property","Weight only","Cost"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Materials"
  },
  {
    text: "ML2 Inspection Q12: What is the bypass ratio in turbofan engines?",
    options: ["1:1","Specific technical ratio","No bypass","Variable"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Inspection"
  },
  {
    text: "ML2 Aircraft Systems Q13: In advanced aircraft systems, what provides automated control?",
    options: ["Manual control","Automated control system","Mechanical linkage","Hydraulic pressure"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Aircraft Systems"
  },
  {
    text: "ML2 Landing Gear Q14: What parameter indicates system malfunction in landing gear?",
    options: ["Normal readings","Abnormal specific reading","No indication","Visual inspection only"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Landing Gear"
  },
  {
    text: "ML2 Instruments Q15: Which material property is critical for high-stress applications?",
    options: ["Color","Specific technical property","Weight only","Cost"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Instruments"
  },
  {
    text: "ML2 Mechanical Systems Q16: What is the bypass ratio in turbofan engines?",
    options: ["1:1","Specific technical ratio","No bypass","Variable"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Mechanical Systems"
  },
  {
    text: "ML2 Hardware Q17: In advanced hardware, what provides automated control?",
    options: ["Manual control","Automated control system","Mechanical linkage","Hydraulic pressure"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Hardware"
  },
  {
    text: "ML2 General Maintenance Q18: What parameter indicates system malfunction in general maintenance?",
    options: ["Normal readings","Abnormal specific reading","No indication","Visual inspection only"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "General Maintenance"
  },
  {
    text: "ML2 Tools and Equipment Q19: Which material property is critical for high-stress applications?",
    options: ["Color","Specific technical property","Weight only","Cost"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Tools and Equipment"
  },
  {
    text: "ML2 Safety Q20: What is the bypass ratio in turbofan engines?",
    options: ["1:1","Specific technical ratio","No bypass","Variable"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Safety"
  },
  {
    text: "ML2 Documentation Q21: In advanced documentation, what provides automated control?",
    options: ["Manual control","Automated control system","Mechanical linkage","Hydraulic pressure"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Documentation"
  },
  {
    text: "ML2 Procedures Q22: What parameter indicates system malfunction in procedures?",
    options: ["Normal readings","Abnormal specific reading","No indication","Visual inspection only"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Procedures"
  },
  {
    text: "ML2 Fuel Systems Q23: Which material property is critical for high-stress applications?",
    options: ["Color","Specific technical property","Weight only","Cost"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Fuel Systems"
  },
  {
    text: "ML2 Electrical Systems Q24: What is the bypass ratio in turbofan engines?",
    options: ["1:1","Specific technical ratio","No bypass","Variable"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Electrical Systems"
  },
  {
    text: "ML2 Hydraulic Systems Q25: In advanced hydraulic systems, what provides automated control?",
    options: ["Manual control","Automated control system","Mechanical linkage","Hydraulic pressure"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Hydraulic Systems"
  },
  {
    text: "ML2 Powerplant Q26: What parameter indicates system malfunction in powerplant?",
    options: ["Normal readings","Abnormal specific reading","No indication","Visual inspection only"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Powerplant"
  },
  {
    text: "ML2 Structural Q27: Which material property is critical for high-stress applications?",
    options: ["Color","Specific technical property","Weight only","Cost"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Structural"
  },
  {
    text: "ML2 Materials Q28: What is the bypass ratio in turbofan engines?",
    options: ["1:1","Specific technical ratio","No bypass","Variable"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Materials"
  },
  {
    text: "ML2 Inspection Q29: In advanced inspection, what provides automated control?",
    options: ["Manual control","Automated control system","Mechanical linkage","Hydraulic pressure"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Inspection"
  },
  {
    text: "ML2 Aircraft Systems Q30: What parameter indicates system malfunction in aircraft systems?",
    options: ["Normal readings","Abnormal specific reading","No indication","Visual inspection only"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Aircraft Systems"
  },
  {
    text: "ML2 Landing Gear Q31: Which material property is critical for high-stress applications?",
    options: ["Color","Specific technical property","Weight only","Cost"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Landing Gear"
  },
  {
    text: "ML2 Instruments Q32: What is the bypass ratio in turbofan engines?",
    options: ["1:1","Specific technical ratio","No bypass","Variable"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Instruments"
  },
  {
    text: "ML2 Mechanical Systems Q33: In advanced mechanical systems, what provides automated control?",
    options: ["Manual control","Automated control system","Mechanical linkage","Hydraulic pressure"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Mechanical Systems"
  },
  {
    text: "ML2 Hardware Q34: What parameter indicates system malfunction in hardware?",
    options: ["Normal readings","Abnormal specific reading","No indication","Visual inspection only"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Hardware"
  },
  {
    text: "ML2 General Maintenance Q35: Which material property is critical for high-stress applications?",
    options: ["Color","Specific technical property","Weight only","Cost"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "General Maintenance"
  },
  {
    text: "ML2 Tools and Equipment Q36: What is the bypass ratio in turbofan engines?",
    options: ["1:1","Specific technical ratio","No bypass","Variable"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Tools and Equipment"
  },
  {
    text: "ML2 Safety Q37: In advanced safety, what provides automated control?",
    options: ["Manual control","Automated control system","Mechanical linkage","Hydraulic pressure"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Safety"
  },
  {
    text: "ML2 Documentation Q38: What parameter indicates system malfunction in documentation?",
    options: ["Normal readings","Abnormal specific reading","No indication","Visual inspection only"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Documentation"
  },
  {
    text: "ML2 Procedures Q39: Which material property is critical for high-stress applications?",
    options: ["Color","Specific technical property","Weight only","Cost"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Procedures"
  },
  {
    text: "ML2 Fuel Systems Q40: What is the bypass ratio in turbofan engines?",
    options: ["1:1","Specific technical ratio","No bypass","Variable"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Fuel Systems"
  },
  {
    text: "ML2 Electrical Systems Q41: In advanced electrical systems, what provides automated control?",
    options: ["Manual control","Automated control system","Mechanical linkage","Hydraulic pressure"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Electrical Systems"
  },
  {
    text: "ML2 Hydraulic Systems Q42: What parameter indicates system malfunction in hydraulic systems?",
    options: ["Normal readings","Abnormal specific reading","No indication","Visual inspection only"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Hydraulic Systems"
  },
  {
    text: "ML2 Powerplant Q43: Which material property is critical for high-stress applications?",
    options: ["Color","Specific technical property","Weight only","Cost"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Powerplant"
  },
  {
    text: "ML2 Structural Q44: What is the bypass ratio in turbofan engines?",
    options: ["1:1","Specific technical ratio","No bypass","Variable"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Structural"
  },
  {
    text: "ML2 Materials Q45: In advanced materials, what provides automated control?",
    options: ["Manual control","Automated control system","Mechanical linkage","Hydraulic pressure"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Materials"
  },
  {
    text: "ML2 Inspection Q46: What parameter indicates system malfunction in inspection?",
    options: ["Normal readings","Abnormal specific reading","No indication","Visual inspection only"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Inspection"
  },
  {
    text: "ML2 Aircraft Systems Q47: Which material property is critical for high-stress applications?",
    options: ["Color","Specific technical property","Weight only","Cost"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Aircraft Systems"
  },
  {
    text: "ML2 Landing Gear Q48: What is the bypass ratio in turbofan engines?",
    options: ["1:1","Specific technical ratio","No bypass","Variable"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Landing Gear"
  },
  {
    text: "ML2 Instruments Q49: In advanced instruments, what provides automated control?",
    options: ["Manual control","Automated control system","Mechanical linkage","Hydraulic pressure"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Instruments"
  },
  {
    text: "ML2 Mechanical Systems Q50: What parameter indicates system malfunction in mechanical systems?",
    options: ["Normal readings","Abnormal specific reading","No indication","Visual inspection only"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Mechanical Systems"
  },
  {
    text: "ML2 Hardware Q51: Which material property is critical for high-stress applications?",
    options: ["Color","Specific technical property","Weight only","Cost"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Hardware"
  },
  {
    text: "ML2 General Maintenance Q52: What is the bypass ratio in turbofan engines?",
    options: ["1:1","Specific technical ratio","No bypass","Variable"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "General Maintenance"
  },
  {
    text: "ML2 Tools and Equipment Q53: In advanced tools and equipment, what provides automated control?",
    options: ["Manual control","Automated control system","Mechanical linkage","Hydraulic pressure"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Tools and Equipment"
  },
  {
    text: "ML2 Safety Q54: What parameter indicates system malfunction in safety?",
    options: ["Normal readings","Abnormal specific reading","No indication","Visual inspection only"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Safety"
  },
  {
    text: "ML2 Documentation Q55: Which material property is critical for high-stress applications?",
    options: ["Color","Specific technical property","Weight only","Cost"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Documentation"
  },
  {
    text: "ML2 Procedures Q56: What is the bypass ratio in turbofan engines?",
    options: ["1:1","Specific technical ratio","No bypass","Variable"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Procedures"
  },
  {
    text: "ML2 Fuel Systems Q57: In advanced fuel systems, what provides automated control?",
    options: ["Manual control","Automated control system","Mechanical linkage","Hydraulic pressure"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Fuel Systems"
  },
  {
    text: "ML2 Electrical Systems Q58: What parameter indicates system malfunction in electrical systems?",
    options: ["Normal readings","Abnormal specific reading","No indication","Visual inspection only"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Electrical Systems"
  },
  {
    text: "ML2 Hydraulic Systems Q59: Which material property is critical for high-stress applications?",
    options: ["Color","Specific technical property","Weight only","Cost"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Hydraulic Systems"
  },
  {
    text: "ML2 Powerplant Q60: What is the bypass ratio in turbofan engines?",
    options: ["1:1","Specific technical ratio","No bypass","Variable"],
    correctAnswer: 1,
    difficulties: ["ML2"],
    category: "Powerplant"
  },
  {
    text: "ML3 General Maintenance Q1: In fly-by-wire systems, what provides flight envelope protection?",
    options: ["Pilot input","Flight control computers","Mechanical systems","Hydraulic actuators"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "General Maintenance"
  },
  {
    text: "ML3 Tools and Equipment Q2: What diagnostic system monitors tools and equipment?",
    options: ["Visual inspection","Integrated health monitoring system","Manual checks","External sensors"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Tools and Equipment"
  },
  {
    text: "ML3 Safety Q3: Which composite repair technique is used for structural damage?",
    options: ["Aluminum patch","Specialized composite repair","Simple adhesive","Riveted repair"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Safety"
  },
  {
    text: "ML3 Documentation Q4: What redundancy level is required for flight-critical systems?",
    options: ["None","Multiple redundant systems","Single backup","Optional backup"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Documentation"
  },
  {
    text: "ML3 Procedures Q5: In fly-by-wire systems, what provides flight envelope protection?",
    options: ["Pilot input","Flight control computers","Mechanical systems","Hydraulic actuators"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Procedures"
  },
  {
    text: "ML3 Fuel Systems Q6: What diagnostic system monitors fuel systems?",
    options: ["Visual inspection","Integrated health monitoring system","Manual checks","External sensors"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Fuel Systems"
  },
  {
    text: "ML3 Electrical Systems Q7: Which composite repair technique is used for structural damage?",
    options: ["Aluminum patch","Specialized composite repair","Simple adhesive","Riveted repair"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Electrical Systems"
  },
  {
    text: "ML3 Hydraulic Systems Q8: What redundancy level is required for flight-critical systems?",
    options: ["None","Multiple redundant systems","Single backup","Optional backup"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Hydraulic Systems"
  },
  {
    text: "ML3 Powerplant Q9: In fly-by-wire systems, what provides flight envelope protection?",
    options: ["Pilot input","Flight control computers","Mechanical systems","Hydraulic actuators"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Powerplant"
  },
  {
    text: "ML3 Structural Q10: What diagnostic system monitors structural?",
    options: ["Visual inspection","Integrated health monitoring system","Manual checks","External sensors"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Structural"
  },
  {
    text: "ML3 Materials Q11: Which composite repair technique is used for structural damage?",
    options: ["Aluminum patch","Specialized composite repair","Simple adhesive","Riveted repair"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Materials"
  },
  {
    text: "ML3 Inspection Q12: What redundancy level is required for flight-critical systems?",
    options: ["None","Multiple redundant systems","Single backup","Optional backup"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Inspection"
  },
  {
    text: "ML3 Aircraft Systems Q13: In fly-by-wire systems, what provides flight envelope protection?",
    options: ["Pilot input","Flight control computers","Mechanical systems","Hydraulic actuators"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Aircraft Systems"
  },
  {
    text: "ML3 Landing Gear Q14: What diagnostic system monitors landing gear?",
    options: ["Visual inspection","Integrated health monitoring system","Manual checks","External sensors"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Landing Gear"
  },
  {
    text: "ML3 Instruments Q15: Which composite repair technique is used for structural damage?",
    options: ["Aluminum patch","Specialized composite repair","Simple adhesive","Riveted repair"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Instruments"
  },
  {
    text: "ML3 Mechanical Systems Q16: What redundancy level is required for flight-critical systems?",
    options: ["None","Multiple redundant systems","Single backup","Optional backup"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Mechanical Systems"
  },
  {
    text: "ML3 Hardware Q17: In fly-by-wire systems, what provides flight envelope protection?",
    options: ["Pilot input","Flight control computers","Mechanical systems","Hydraulic actuators"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Hardware"
  },
  {
    text: "ML3 General Maintenance Q18: What diagnostic system monitors general maintenance?",
    options: ["Visual inspection","Integrated health monitoring system","Manual checks","External sensors"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "General Maintenance"
  },
  {
    text: "ML3 Tools and Equipment Q19: Which composite repair technique is used for structural damage?",
    options: ["Aluminum patch","Specialized composite repair","Simple adhesive","Riveted repair"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Tools and Equipment"
  },
  {
    text: "ML3 Safety Q20: What redundancy level is required for flight-critical systems?",
    options: ["None","Multiple redundant systems","Single backup","Optional backup"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Safety"
  },
  {
    text: "ML3 Documentation Q21: In fly-by-wire systems, what provides flight envelope protection?",
    options: ["Pilot input","Flight control computers","Mechanical systems","Hydraulic actuators"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Documentation"
  },
  {
    text: "ML3 Procedures Q22: What diagnostic system monitors procedures?",
    options: ["Visual inspection","Integrated health monitoring system","Manual checks","External sensors"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Procedures"
  },
  {
    text: "ML3 Fuel Systems Q23: Which composite repair technique is used for structural damage?",
    options: ["Aluminum patch","Specialized composite repair","Simple adhesive","Riveted repair"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Fuel Systems"
  },
  {
    text: "ML3 Electrical Systems Q24: What redundancy level is required for flight-critical systems?",
    options: ["None","Multiple redundant systems","Single backup","Optional backup"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Electrical Systems"
  },
  {
    text: "ML3 Hydraulic Systems Q25: In fly-by-wire systems, what provides flight envelope protection?",
    options: ["Pilot input","Flight control computers","Mechanical systems","Hydraulic actuators"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Hydraulic Systems"
  },
  {
    text: "ML3 Powerplant Q26: What diagnostic system monitors powerplant?",
    options: ["Visual inspection","Integrated health monitoring system","Manual checks","External sensors"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Powerplant"
  },
  {
    text: "ML3 Structural Q27: Which composite repair technique is used for structural damage?",
    options: ["Aluminum patch","Specialized composite repair","Simple adhesive","Riveted repair"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Structural"
  },
  {
    text: "ML3 Materials Q28: What redundancy level is required for flight-critical systems?",
    options: ["None","Multiple redundant systems","Single backup","Optional backup"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Materials"
  },
  {
    text: "ML3 Inspection Q29: In fly-by-wire systems, what provides flight envelope protection?",
    options: ["Pilot input","Flight control computers","Mechanical systems","Hydraulic actuators"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Inspection"
  },
  {
    text: "ML3 Aircraft Systems Q30: What diagnostic system monitors aircraft systems?",
    options: ["Visual inspection","Integrated health monitoring system","Manual checks","External sensors"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Aircraft Systems"
  },
  {
    text: "ML3 Landing Gear Q31: Which composite repair technique is used for structural damage?",
    options: ["Aluminum patch","Specialized composite repair","Simple adhesive","Riveted repair"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Landing Gear"
  },
  {
    text: "ML3 Instruments Q32: What redundancy level is required for flight-critical systems?",
    options: ["None","Multiple redundant systems","Single backup","Optional backup"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Instruments"
  },
  {
    text: "ML3 Mechanical Systems Q33: In fly-by-wire systems, what provides flight envelope protection?",
    options: ["Pilot input","Flight control computers","Mechanical systems","Hydraulic actuators"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Mechanical Systems"
  },
  {
    text: "ML3 Hardware Q34: What diagnostic system monitors hardware?",
    options: ["Visual inspection","Integrated health monitoring system","Manual checks","External sensors"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Hardware"
  },
  {
    text: "ML3 General Maintenance Q35: Which composite repair technique is used for structural damage?",
    options: ["Aluminum patch","Specialized composite repair","Simple adhesive","Riveted repair"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "General Maintenance"
  },
  {
    text: "ML3 Tools and Equipment Q36: What redundancy level is required for flight-critical systems?",
    options: ["None","Multiple redundant systems","Single backup","Optional backup"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Tools and Equipment"
  },
  {
    text: "ML3 Safety Q37: In fly-by-wire systems, what provides flight envelope protection?",
    options: ["Pilot input","Flight control computers","Mechanical systems","Hydraulic actuators"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Safety"
  },
  {
    text: "ML3 Documentation Q38: What diagnostic system monitors documentation?",
    options: ["Visual inspection","Integrated health monitoring system","Manual checks","External sensors"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Documentation"
  },
  {
    text: "ML3 Procedures Q39: Which composite repair technique is used for structural damage?",
    options: ["Aluminum patch","Specialized composite repair","Simple adhesive","Riveted repair"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Procedures"
  },
  {
    text: "ML3 Fuel Systems Q40: What redundancy level is required for flight-critical systems?",
    options: ["None","Multiple redundant systems","Single backup","Optional backup"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Fuel Systems"
  },
  {
    text: "ML3 Electrical Systems Q41: In fly-by-wire systems, what provides flight envelope protection?",
    options: ["Pilot input","Flight control computers","Mechanical systems","Hydraulic actuators"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Electrical Systems"
  },
  {
    text: "ML3 Hydraulic Systems Q42: What diagnostic system monitors hydraulic systems?",
    options: ["Visual inspection","Integrated health monitoring system","Manual checks","External sensors"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Hydraulic Systems"
  },
  {
    text: "ML3 Powerplant Q43: Which composite repair technique is used for structural damage?",
    options: ["Aluminum patch","Specialized composite repair","Simple adhesive","Riveted repair"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Powerplant"
  },
  {
    text: "ML3 Structural Q44: What redundancy level is required for flight-critical systems?",
    options: ["None","Multiple redundant systems","Single backup","Optional backup"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Structural"
  },
  {
    text: "ML3 Materials Q45: In fly-by-wire systems, what provides flight envelope protection?",
    options: ["Pilot input","Flight control computers","Mechanical systems","Hydraulic actuators"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Materials"
  },
  {
    text: "ML3 Inspection Q46: What diagnostic system monitors inspection?",
    options: ["Visual inspection","Integrated health monitoring system","Manual checks","External sensors"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Inspection"
  },
  {
    text: "ML3 Aircraft Systems Q47: Which composite repair technique is used for structural damage?",
    options: ["Aluminum patch","Specialized composite repair","Simple adhesive","Riveted repair"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Aircraft Systems"
  },
  {
    text: "ML3 Landing Gear Q48: What redundancy level is required for flight-critical systems?",
    options: ["None","Multiple redundant systems","Single backup","Optional backup"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Landing Gear"
  },
  {
    text: "ML3 Instruments Q49: In fly-by-wire systems, what provides flight envelope protection?",
    options: ["Pilot input","Flight control computers","Mechanical systems","Hydraulic actuators"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Instruments"
  },
  {
    text: "ML3 Mechanical Systems Q50: What diagnostic system monitors mechanical systems?",
    options: ["Visual inspection","Integrated health monitoring system","Manual checks","External sensors"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Mechanical Systems"
  },
  {
    text: "ML3 Hardware Q51: Which composite repair technique is used for structural damage?",
    options: ["Aluminum patch","Specialized composite repair","Simple adhesive","Riveted repair"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Hardware"
  },
  {
    text: "ML3 General Maintenance Q52: What redundancy level is required for flight-critical systems?",
    options: ["None","Multiple redundant systems","Single backup","Optional backup"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "General Maintenance"
  },
  {
    text: "ML3 Tools and Equipment Q53: In fly-by-wire systems, what provides flight envelope protection?",
    options: ["Pilot input","Flight control computers","Mechanical systems","Hydraulic actuators"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Tools and Equipment"
  },
  {
    text: "ML3 Safety Q54: What diagnostic system monitors safety?",
    options: ["Visual inspection","Integrated health monitoring system","Manual checks","External sensors"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Safety"
  },
  {
    text: "ML3 Documentation Q55: Which composite repair technique is used for structural damage?",
    options: ["Aluminum patch","Specialized composite repair","Simple adhesive","Riveted repair"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Documentation"
  },
  {
    text: "ML3 Procedures Q56: What redundancy level is required for flight-critical systems?",
    options: ["None","Multiple redundant systems","Single backup","Optional backup"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Procedures"
  },
  {
    text: "ML3 Fuel Systems Q57: In fly-by-wire systems, what provides flight envelope protection?",
    options: ["Pilot input","Flight control computers","Mechanical systems","Hydraulic actuators"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Fuel Systems"
  },
  {
    text: "ML3 Electrical Systems Q58: What diagnostic system monitors electrical systems?",
    options: ["Visual inspection","Integrated health monitoring system","Manual checks","External sensors"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Electrical Systems"
  },
  {
    text: "ML3 Hydraulic Systems Q59: Which composite repair technique is used for structural damage?",
    options: ["Aluminum patch","Specialized composite repair","Simple adhesive","Riveted repair"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Hydraulic Systems"
  },
  {
    text: "ML3 Powerplant Q60: What redundancy level is required for flight-critical systems?",
    options: ["None","Multiple redundant systems","Single backup","Optional backup"],
    correctAnswer: 1,
    difficulties: ["ML3"],
    category: "Powerplant"
  },
  {
    text: "ML4 General Maintenance Q1: What AI system optimizes flight envelope protection?",
    options: ["Manual calculation","Machine learning based optimization","Simple algorithm","Lookup table"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "General Maintenance"
  },
  {
    text: "ML4 Tools and Equipment Q2: How does emerging technology improve maintenance efficiency?",
    options: ["No improvement","Significant technical improvement","Minor improvement","Cost reduction only"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Tools and Equipment"
  },
  {
    text: "ML4 Safety Q3: What predictive maintenance technique identifies component fatigue?",
    options: ["Visual inspection","AI-powered predictive analytics","Scheduled checks","Reactive maintenance"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Safety"
  },
  {
    text: "ML4 Documentation Q4: Which advanced material offers superior performance for high-stress applications?",
    options: ["Standard aluminum","Advanced composite or alloy","Steel","Plastic"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Documentation"
  },
  {
    text: "ML4 Procedures Q5: What AI system optimizes flight envelope protection?",
    options: ["Manual calculation","Machine learning based optimization","Simple algorithm","Lookup table"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Procedures"
  },
  {
    text: "ML4 Fuel Systems Q6: How does emerging technology improve maintenance efficiency?",
    options: ["No improvement","Significant technical improvement","Minor improvement","Cost reduction only"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Fuel Systems"
  },
  {
    text: "ML4 Electrical Systems Q7: What predictive maintenance technique identifies component fatigue?",
    options: ["Visual inspection","AI-powered predictive analytics","Scheduled checks","Reactive maintenance"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Electrical Systems"
  },
  {
    text: "ML4 Hydraulic Systems Q8: Which advanced material offers superior performance for high-stress applications?",
    options: ["Standard aluminum","Advanced composite or alloy","Steel","Plastic"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Hydraulic Systems"
  },
  {
    text: "ML4 Powerplant Q9: What AI system optimizes flight envelope protection?",
    options: ["Manual calculation","Machine learning based optimization","Simple algorithm","Lookup table"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Powerplant"
  },
  {
    text: "ML4 Structural Q10: How does emerging technology improve maintenance efficiency?",
    options: ["No improvement","Significant technical improvement","Minor improvement","Cost reduction only"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Structural"
  },
  {
    text: "ML4 Materials Q11: What predictive maintenance technique identifies component fatigue?",
    options: ["Visual inspection","AI-powered predictive analytics","Scheduled checks","Reactive maintenance"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Materials"
  },
  {
    text: "ML4 Inspection Q12: Which advanced material offers superior performance for high-stress applications?",
    options: ["Standard aluminum","Advanced composite or alloy","Steel","Plastic"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Inspection"
  },
  {
    text: "ML4 Aircraft Systems Q13: What AI system optimizes flight envelope protection?",
    options: ["Manual calculation","Machine learning based optimization","Simple algorithm","Lookup table"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Aircraft Systems"
  },
  {
    text: "ML4 Landing Gear Q14: How does emerging technology improve maintenance efficiency?",
    options: ["No improvement","Significant technical improvement","Minor improvement","Cost reduction only"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Landing Gear"
  },
  {
    text: "ML4 Instruments Q15: What predictive maintenance technique identifies component fatigue?",
    options: ["Visual inspection","AI-powered predictive analytics","Scheduled checks","Reactive maintenance"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Instruments"
  },
  {
    text: "ML4 Mechanical Systems Q16: Which advanced material offers superior performance for high-stress applications?",
    options: ["Standard aluminum","Advanced composite or alloy","Steel","Plastic"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Mechanical Systems"
  },
  {
    text: "ML4 Hardware Q17: What AI system optimizes flight envelope protection?",
    options: ["Manual calculation","Machine learning based optimization","Simple algorithm","Lookup table"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Hardware"
  },
  {
    text: "ML4 General Maintenance Q18: How does emerging technology improve maintenance efficiency?",
    options: ["No improvement","Significant technical improvement","Minor improvement","Cost reduction only"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "General Maintenance"
  },
  {
    text: "ML4 Tools and Equipment Q19: What predictive maintenance technique identifies component fatigue?",
    options: ["Visual inspection","AI-powered predictive analytics","Scheduled checks","Reactive maintenance"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Tools and Equipment"
  },
  {
    text: "ML4 Safety Q20: Which advanced material offers superior performance for high-stress applications?",
    options: ["Standard aluminum","Advanced composite or alloy","Steel","Plastic"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Safety"
  },
  {
    text: "ML4 Documentation Q21: What AI system optimizes flight envelope protection?",
    options: ["Manual calculation","Machine learning based optimization","Simple algorithm","Lookup table"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Documentation"
  },
  {
    text: "ML4 Procedures Q22: How does emerging technology improve maintenance efficiency?",
    options: ["No improvement","Significant technical improvement","Minor improvement","Cost reduction only"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Procedures"
  },
  {
    text: "ML4 Fuel Systems Q23: What predictive maintenance technique identifies component fatigue?",
    options: ["Visual inspection","AI-powered predictive analytics","Scheduled checks","Reactive maintenance"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Fuel Systems"
  },
  {
    text: "ML4 Electrical Systems Q24: Which advanced material offers superior performance for high-stress applications?",
    options: ["Standard aluminum","Advanced composite or alloy","Steel","Plastic"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Electrical Systems"
  },
  {
    text: "ML4 Hydraulic Systems Q25: What AI system optimizes flight envelope protection?",
    options: ["Manual calculation","Machine learning based optimization","Simple algorithm","Lookup table"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Hydraulic Systems"
  },
  {
    text: "ML4 Powerplant Q26: How does emerging technology improve maintenance efficiency?",
    options: ["No improvement","Significant technical improvement","Minor improvement","Cost reduction only"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Powerplant"
  },
  {
    text: "ML4 Structural Q27: What predictive maintenance technique identifies component fatigue?",
    options: ["Visual inspection","AI-powered predictive analytics","Scheduled checks","Reactive maintenance"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Structural"
  },
  {
    text: "ML4 Materials Q28: Which advanced material offers superior performance for high-stress applications?",
    options: ["Standard aluminum","Advanced composite or alloy","Steel","Plastic"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Materials"
  },
  {
    text: "ML4 Inspection Q29: What AI system optimizes flight envelope protection?",
    options: ["Manual calculation","Machine learning based optimization","Simple algorithm","Lookup table"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Inspection"
  },
  {
    text: "ML4 Aircraft Systems Q30: How does emerging technology improve maintenance efficiency?",
    options: ["No improvement","Significant technical improvement","Minor improvement","Cost reduction only"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Aircraft Systems"
  },
  {
    text: "ML4 Landing Gear Q31: What predictive maintenance technique identifies component fatigue?",
    options: ["Visual inspection","AI-powered predictive analytics","Scheduled checks","Reactive maintenance"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Landing Gear"
  },
  {
    text: "ML4 Instruments Q32: Which advanced material offers superior performance for high-stress applications?",
    options: ["Standard aluminum","Advanced composite or alloy","Steel","Plastic"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Instruments"
  },
  {
    text: "ML4 Mechanical Systems Q33: What AI system optimizes flight envelope protection?",
    options: ["Manual calculation","Machine learning based optimization","Simple algorithm","Lookup table"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Mechanical Systems"
  },
  {
    text: "ML4 Hardware Q34: How does emerging technology improve maintenance efficiency?",
    options: ["No improvement","Significant technical improvement","Minor improvement","Cost reduction only"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Hardware"
  },
  {
    text: "ML4 General Maintenance Q35: What predictive maintenance technique identifies component fatigue?",
    options: ["Visual inspection","AI-powered predictive analytics","Scheduled checks","Reactive maintenance"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "General Maintenance"
  },
  {
    text: "ML4 Tools and Equipment Q36: Which advanced material offers superior performance for high-stress applications?",
    options: ["Standard aluminum","Advanced composite or alloy","Steel","Plastic"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Tools and Equipment"
  },
  {
    text: "ML4 Safety Q37: What AI system optimizes flight envelope protection?",
    options: ["Manual calculation","Machine learning based optimization","Simple algorithm","Lookup table"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Safety"
  },
  {
    text: "ML4 Documentation Q38: How does emerging technology improve maintenance efficiency?",
    options: ["No improvement","Significant technical improvement","Minor improvement","Cost reduction only"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Documentation"
  },
  {
    text: "ML4 Procedures Q39: What predictive maintenance technique identifies component fatigue?",
    options: ["Visual inspection","AI-powered predictive analytics","Scheduled checks","Reactive maintenance"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Procedures"
  },
  {
    text: "ML4 Fuel Systems Q40: Which advanced material offers superior performance for high-stress applications?",
    options: ["Standard aluminum","Advanced composite or alloy","Steel","Plastic"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Fuel Systems"
  },
  {
    text: "ML4 Electrical Systems Q41: What AI system optimizes flight envelope protection?",
    options: ["Manual calculation","Machine learning based optimization","Simple algorithm","Lookup table"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Electrical Systems"
  },
  {
    text: "ML4 Hydraulic Systems Q42: How does emerging technology improve maintenance efficiency?",
    options: ["No improvement","Significant technical improvement","Minor improvement","Cost reduction only"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Hydraulic Systems"
  },
  {
    text: "ML4 Powerplant Q43: What predictive maintenance technique identifies component fatigue?",
    options: ["Visual inspection","AI-powered predictive analytics","Scheduled checks","Reactive maintenance"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Powerplant"
  },
  {
    text: "ML4 Structural Q44: Which advanced material offers superior performance for high-stress applications?",
    options: ["Standard aluminum","Advanced composite or alloy","Steel","Plastic"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Structural"
  },
  {
    text: "ML4 Materials Q45: What AI system optimizes flight envelope protection?",
    options: ["Manual calculation","Machine learning based optimization","Simple algorithm","Lookup table"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Materials"
  },
  {
    text: "ML4 Inspection Q46: How does emerging technology improve maintenance efficiency?",
    options: ["No improvement","Significant technical improvement","Minor improvement","Cost reduction only"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Inspection"
  },
  {
    text: "ML4 Aircraft Systems Q47: What predictive maintenance technique identifies component fatigue?",
    options: ["Visual inspection","AI-powered predictive analytics","Scheduled checks","Reactive maintenance"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Aircraft Systems"
  },
  {
    text: "ML4 Landing Gear Q48: Which advanced material offers superior performance for high-stress applications?",
    options: ["Standard aluminum","Advanced composite or alloy","Steel","Plastic"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Landing Gear"
  },
  {
    text: "ML4 Instruments Q49: What AI system optimizes flight envelope protection?",
    options: ["Manual calculation","Machine learning based optimization","Simple algorithm","Lookup table"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Instruments"
  },
  {
    text: "ML4 Mechanical Systems Q50: How does emerging technology improve maintenance efficiency?",
    options: ["No improvement","Significant technical improvement","Minor improvement","Cost reduction only"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Mechanical Systems"
  },
  {
    text: "ML4 Hardware Q51: What predictive maintenance technique identifies component fatigue?",
    options: ["Visual inspection","AI-powered predictive analytics","Scheduled checks","Reactive maintenance"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Hardware"
  },
  {
    text: "ML4 General Maintenance Q52: Which advanced material offers superior performance for high-stress applications?",
    options: ["Standard aluminum","Advanced composite or alloy","Steel","Plastic"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "General Maintenance"
  },
  {
    text: "ML4 Tools and Equipment Q53: What AI system optimizes flight envelope protection?",
    options: ["Manual calculation","Machine learning based optimization","Simple algorithm","Lookup table"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Tools and Equipment"
  },
  {
    text: "ML4 Safety Q54: How does emerging technology improve maintenance efficiency?",
    options: ["No improvement","Significant technical improvement","Minor improvement","Cost reduction only"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Safety"
  },
  {
    text: "ML4 Documentation Q55: What predictive maintenance technique identifies component fatigue?",
    options: ["Visual inspection","AI-powered predictive analytics","Scheduled checks","Reactive maintenance"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Documentation"
  },
  {
    text: "ML4 Procedures Q56: Which advanced material offers superior performance for high-stress applications?",
    options: ["Standard aluminum","Advanced composite or alloy","Steel","Plastic"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Procedures"
  },
  {
    text: "ML4 Fuel Systems Q57: What AI system optimizes flight envelope protection?",
    options: ["Manual calculation","Machine learning based optimization","Simple algorithm","Lookup table"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Fuel Systems"
  },
  {
    text: "ML4 Electrical Systems Q58: How does emerging technology improve maintenance efficiency?",
    options: ["No improvement","Significant technical improvement","Minor improvement","Cost reduction only"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Electrical Systems"
  },
  {
    text: "ML4 Hydraulic Systems Q59: What predictive maintenance technique identifies component fatigue?",
    options: ["Visual inspection","AI-powered predictive analytics","Scheduled checks","Reactive maintenance"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Hydraulic Systems"
  },
  {
    text: "ML4 Powerplant Q60: Which advanced material offers superior performance for high-stress applications?",
    options: ["Standard aluminum","Advanced composite or alloy","Steel","Plastic"],
    correctAnswer: 1,
    difficulties: ["ML4"],
    category: "Powerplant"
  }
];

export async function seedDatabase() {
  try {
    console.log("Seeding database with sample questions...");
    
    // Check if questions already exist
    const existingQuestions = await db.select().from(questions).limit(1);
    if (existingQuestions.length > 0) {
      console.log("Database already has questions, skipping seed.");
      return;
    }

    // Insert sample questions
    await db.insert(questions).values(sampleQuestions);
    console.log(`Successfully seeded ${sampleQuestions.length} questions.`);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
