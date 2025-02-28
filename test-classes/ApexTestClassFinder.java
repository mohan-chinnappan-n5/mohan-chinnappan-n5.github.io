import java.io.File;
import java.util.*;

public class ApexTestClassFinder {
    public static void main(String[] args) {
        // Parse the command-line argument
        String apexFolderPath = parseCommandLineArg(args, "--cls-folder");
        
        // Validate the folder path
        if (apexFolderPath == null || apexFolderPath.isEmpty()) {
            System.out.println("Usage: java ApexTestClassFinder --cls-folder <path_to_apex_classes_folder>");
            return;
        }

        File folder = new File(apexFolderPath);
        if (!folder.exists() || !folder.isDirectory()) {
            System.out.println("Invalid folder path: " + apexFolderPath);
            return;
        }

        // Store Apex classes and their test classes
        List<String> apexClasses = new ArrayList<>();
        List<String> testClasses = new ArrayList<>();

        // Read files from the folder
        File[] files = folder.listFiles((dir, name) -> name.endsWith(".cls"));
        if (files == null || files.length == 0) {
            System.out.println("No Apex class files found in " + apexFolderPath);
            return;
        }

        // Categorize files
        for (File file : files) {
            String fileName = file.getName().replace(".cls", ""); // Remove .cls extension
            if (fileName.endsWith("Test") || fileName.startsWith("Test")) {
                testClasses.add(fileName);
            } else {
                apexClasses.add(fileName);
            }
        }

        // Map Apex classes to their test classes
        Map<String, List<String>> classToTestMap = new HashMap<>();
        for (String apexClass : apexClasses) {
            List<String> relatedTests = new ArrayList<>();

            // Expected test class names
            String expectedTestSuffix = apexClass + "Test";
            String expectedTestPrefix = "Test" + apexClass;

            for (String testClass : testClasses) {
                if (testClass.equals(expectedTestSuffix) || testClass.equals(expectedTestPrefix)) {
                    relatedTests.add(testClass);
                }
            }

            classToTestMap.put(apexClass, relatedTests.isEmpty() ? Collections.singletonList("No test class found") : relatedTests);
        }

        // Print results
        System.out.println("\nApex Classes and their corresponding Test Classes:");
        classToTestMap.forEach((apexClass, tests) ->
            System.out.println(apexClass + " -> " + String.join(", ", tests)));
    }

    private static String parseCommandLineArg(String[] args, String option) {
        for (int i = 0; i < args.length; i++) {
            if (args[i].equals(option) && i + 1 < args.length) {
                return args[i + 1];
            }
        }
        return null;
    }
}