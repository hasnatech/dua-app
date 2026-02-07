export default function ActiveLabel({ isActive }: { isActive: boolean }) {
    return isActive ? (
        <span className="rounded-full bg-green-500 px-3 py-1 text-xs text-white">Yes</span>
    ) : (
        <span className="rounded-full bg-red-500 px-3 py-1 text-xs text-white">No</span>
    );
}