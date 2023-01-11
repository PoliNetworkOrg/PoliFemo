import { exec } from "child_process"
import { promisify } from "util"
const execAsync = promisify(exec)

const { stdout } = await execAsync("git branch -r")
const remoteBranches = stdout.split("\n").filter((b, i) => i > 0)
const currentBranchNames = remoteBranches
    .map(branch => {
        const m = branch.match(/origin\/(.*)/)
        return m ? m[1] : null
    })
    .filter(b => b !== null)

// get all branches from eas
const { stdout: json } = await execAsync(
    "eas branch:list --json --non-interactive",
    {
        maxBuffer: 1024 * 1024 * 10, // 10mb, required for lots of branches
    }
)
const easBranches = JSON.parse(json)
const easBranchNames = easBranches.map(b => b.name)
const branchesToDelete = easBranchNames
    .filter(b => !currentBranchNames.includes(b))
    .filter(b => b !== "main")

console.log("\nCurrent git branches:\n" + currentBranchNames.join("\n - "))
console.log("\nCurrent EAS branches:\n" + easBranchNames.join("\n - "))
console.log("\nBranches to be deleted:\n" + branchesToDelete.join("\n - "))

// delete branches from eas
for (const branch of branchesToDelete) {
    try {
        // delete channel first
        await execAsync(`eas channel:delete ${branch} --non-interactive`)
    } catch (e) {
        // apparently, it could happen that the channel is already deleted but the branch is not
        console.error(`unable to delete channel for branch ${branch}`)
    }

    // delete branch
    await execAsync(`eas branch:delete ${branch} --non-interactive`)
    console.log(`Deleted branch ${branch} from EAS`)
}
