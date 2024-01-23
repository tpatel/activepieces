import { ActivepiecesError, ErrorCode } from '../common/activepieces-error'
import { PackageType, PiecePackage } from './piece'

export const getPackageAliasForPiece = (params: GetPackageAliasForPieceParams): string => {
    const { pieceName, pieceVersion } = params
    return `${pieceName}-${pieceVersion}`
}

export const getPackageSpecForPiece = (packageArchivePath: string, params: PiecePackage): string => {
    const { packageType, pieceName, pieceVersion } = params

    switch (packageType) {
        case PackageType.REGISTRY: {
            return `npm:${pieceName}@${pieceVersion}`
        }

        case PackageType.ARCHIVE: {
            const archivePath = getPackageArchivePathForPiece({
                archiveId: params.archiveId,
                archivePath: packageArchivePath,
            })

            return `file:${archivePath}`
        }
    }
}

export const getPackageArchivePathForPiece = (params: GetPackageArchivePathForPieceParams): string => {
    return `${params.archivePath}/${params.archiveId}.tgz`
}

export const extractPieceFromModule = <T>(params: ExtractPieceFromModuleParams): T => {
    const { module, pieceName, pieceVersion } = params
    const exports = Object.values(module)

    for (const e of exports) {
        if (e !== null && e !== undefined && e.constructor.name === 'Piece') {
            return e as T
        }
    }

    throw new ActivepiecesError({
        code: ErrorCode.PIECE_NOT_FOUND,
        params: {
            pieceName,
            pieceVersion,
        },
    })
}

type GetPackageAliasForPieceParams = {
    pieceName: string
    pieceVersion: string
}


type GetPackageArchivePathForPieceParams = {
    archiveId: string
    archivePath: string
}

type ExtractPieceFromModuleParams = {
    module: Record<string, unknown>
    pieceName: string
    pieceVersion: string
}
